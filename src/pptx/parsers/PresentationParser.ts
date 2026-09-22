import { parseXml } from '../utils/xml';
import { ZipReader } from '../ZipReader';

export interface SlideReference {
  id: string;
  relId: string;
}

export interface PresentationConfig {
  width: number;
  height: number;
  slideRefs: SlideReference[];
}

export class PresentationParser {
  static async parsePresentation(zipReader: ZipReader): Promise<PresentationConfig> {
    const xml = await zipReader.getFileText('ppt/presentation.xml');
    if (!xml) throw new Error('ppt/presentation.xml not found');

    const doc = parseXml(xml);
    
    // Parse slide size
    let width = 9144000; // default 10 inches
    let height = 5143500; // default 5.625 inches (16:9)

    const sldSz = doc.getElementsByTagName('p:sldSz')[0];
    if (sldSz) {
      const cx = sldSz.getAttribute('cx');
      const cy = sldSz.getAttribute('cy');
      const parsedWidth = cx ? Number.parseInt(cx, 10) : Number.NaN;
      const parsedHeight = cy ? Number.parseInt(cy, 10) : Number.NaN;
      if (Number.isFinite(parsedWidth) && parsedWidth > 0) width = parsedWidth;
      if (Number.isFinite(parsedHeight) && parsedHeight > 0) height = parsedHeight;
    }

    // Parse slide references
    const slideRefs: SlideReference[] = [];
    const sldIdLst = doc.getElementsByTagName('p:sldIdLst')[0];
    if (sldIdLst) {
      const sldIds = sldIdLst.getElementsByTagName('p:sldId');
      for (let i = 0; i < sldIds.length; i++) {
        const id = sldIds[i].getAttribute('id');
        const relId = sldIds[i].getAttribute('r:id');
        if (id && relId) {
          slideRefs.push({ id, relId });
        }
      }
    }

    if (slideRefs.length === 0) {
      throw new Error('The presentation does not contain any slides.');
    }

    return { width, height, slideRefs };
  }
}
