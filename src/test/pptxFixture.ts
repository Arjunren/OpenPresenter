import JSZip from 'jszip';

interface FixtureOptions {
  name?: string;
  width?: number;
  height?: number;
  malformedFirstSlide?: boolean;
  imageCount?: number;
}

const relationships = (body: string) => `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${body}
</Relationships>`;

const createPicturesXml = (imageCount: number) => Array.from({ length: imageCount }, (_, index) => `
      <p:pic>
        <p:nvPicPr><p:cNvPr id="${index + 3}" name="Test image ${index + 1}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
        <p:blipFill><a:blip r:embed="rIdImage"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
        <p:spPr><a:xfrm><a:off x="${4_900_000 + (index % 6) * 550_000}" y="${500_000 + Math.floor(index / 6) * 550_000}"/><a:ext cx="500000" cy="500000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
      </p:pic>`).join('');

const createSlideXml = (imageCount: number) => `<?xml version="1.0" encoding="UTF-8"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="F8FAFC"/></a:solidFill></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title shape"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm rot="60000"><a:off x="914400" y="514350"/><a:ext cx="3657600" cy="1028700"/></a:xfrm>
          <a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom>
          <a:solidFill><a:srgbClr val="2563EB"/></a:solidFill>
          <a:ln w="12700"><a:solidFill><a:srgbClr val="1E3A8A"/></a:solidFill></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/><a:lstStyle/>
          <a:p>
            <a:pPr algn="ctr"><a:buChar char="•"/></a:pPr>
            <a:r><a:rPr lang="en-US" sz="2400" b="1" i="1" u="sng"><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:latin typeface="Aptos"/></a:rPr><a:t>Hello OpenPresenter</a:t></a:r>
            <a:r><a:rPr lang="en-US" sz="1800"><a:solidFill><a:srgbClr val="DBEAFE"/></a:solidFill><a:latin typeface="Georgia"/></a:rPr><a:t> with multiple fonts</a:t></a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      ${createPicturesXml(imageCount)}
    </p:spTree>
  </p:cSld>
</p:sld>`;

const emptySlideXml = `<?xml version="1.0" encoding="UTF-8"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sld>`;

export async function createPptxFixture(options: FixtureOptions = {}): Promise<File> {
  const width = options.width ?? 9_144_000;
  const height = options.height ?? 5_143_500;
  const zip = new JSZip();

  zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>');
  zip.file('_rels/.rels', relationships('<Relationship Id="rId1" Type="officeDocument" Target="ppt/presentation.xml"/>'));
  zip.file('ppt/presentation.xml', `<?xml version="1.0" encoding="UTF-8"?>
    <p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
      <p:sldIdLst><p:sldId id="256" r:id="rId1"/><p:sldId id="257" r:id="rId2"/></p:sldIdLst>
      <p:sldSz cx="${width}" cy="${height}"/>
    </p:presentation>`);
  zip.file('ppt/_rels/presentation.xml.rels', relationships(`
    <Relationship Id="rId1" Type="slide" Target="slides/slide1.xml"/>
    <Relationship Id="rId2" Type="slide" Target="slides/slide2.xml"/>`));
  zip.file('ppt/slides/slide1.xml', options.malformedFirstSlide ? '<p:sld>' : createSlideXml(options.imageCount ?? 1));
  zip.file('ppt/slides/slide2.xml', emptySlideXml);
  zip.file('ppt/slides/_rels/slide1.xml.rels', relationships('<Relationship Id="rIdImage" Type="image" Target="../media/image1.png"/>'));
  zip.file('ppt/media/image1.png', new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]));

  const bytes = await zip.generateAsync({ type: 'uint8array' });
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new File([buffer], options.name ?? 'phase-10-fixture.pptx', {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });
}
