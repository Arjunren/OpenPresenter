import { parseXml } from '../utils/xml';
import { ZipReader } from '../ZipReader';
import { RelationshipParser } from './RelationshipParser';
import { MediaParser } from './MediaParser';
import type { Slide, SlideBackground } from '../../models/Slide';
import type { BaseSlideElement } from '../../models/SlideElement';
import type { TextElement, Paragraph, TextRun } from '../../models/TextElement';
import type { ImageElement } from '../../models/ImageElement';
import type { ShapeElement } from '../../models/ShapeElement';

const mapAlignment = (value: string | null): Paragraph['alignment'] => {
  switch (value) {
    case 'ctr': return 'center';
    case 'r': return 'right';
    case 'just':
    case 'justLow': return 'justify';
    default: return 'left';
  }
};

const parseBooleanAttribute = (node: Element, attribute: string): boolean => {
  const value = node.getAttribute(attribute);
  return value === '1' || value === 'true';
};

const parseRgbColor = (node: Element | null | undefined): string | undefined => {
  const color = node?.getElementsByTagName('a:srgbClr')[0]?.getAttribute('val');
  return color?.replace(/^#/, '').toUpperCase();
};

export class SlideParser {
  static async parseSlide(
    zipReader: ZipReader,
    slidePath: string,
    slideId: string,
    slideIndex: number,
    presWidth: number,
    presHeight: number
  ): Promise<Slide> {
    const xml = await zipReader.getFileText(slidePath);
    if (!xml) throw new Error(`Slide file not found: ${slidePath}`);

    const slideDir = slidePath.substring(0, slidePath.lastIndexOf('/'));
    const slideFileName = slidePath.substring(slidePath.lastIndexOf('/') + 1);
    const relsPath = `${slideDir}/_rels/${slideFileName}.rels`;
    const rels = await RelationshipParser.parseRels(zipReader, relsPath);

    const doc = parseXml(xml);
    const elements: BaseSlideElement[] = [];
    let zIndex = 0;

    const toPercentX = (emu: number) => (emu / presWidth) * 100;
    const toPercentY = (emu: number) => (emu / presHeight) * 100;

    const parseTransform = (xfrmNode: Element) => {
      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;
      let rotation = 0;
      const off = xfrmNode.getElementsByTagName('a:off')[0];
      if (off) {
        x = toPercentX(Number.parseInt(off.getAttribute('x') || '0', 10));
        y = toPercentY(Number.parseInt(off.getAttribute('y') || '0', 10));
      }
      const ext = xfrmNode.getElementsByTagName('a:ext')[0];
      if (ext) {
        width = toPercentX(Number.parseInt(ext.getAttribute('cx') || '0', 10));
        height = toPercentY(Number.parseInt(ext.getAttribute('cy') || '0', 10));
      }
      const rot = xfrmNode.getAttribute('rot');
      if (rot) rotation = Number.parseInt(rot, 10) / 60_000;
      return { x, y, width, height, rotation };
    };

    const parseTextRun = (text: string, runProperties?: Element): TextRun => {
      const size = runProperties?.getAttribute('sz');
      const fontFamily = runProperties?.getElementsByTagName('a:latin')[0]?.getAttribute('typeface') || undefined;
      return {
        text,
        isBold: runProperties ? parseBooleanAttribute(runProperties, 'b') : false,
        isItalic: runProperties ? parseBooleanAttribute(runProperties, 'i') : false,
        isUnderline: runProperties?.getAttribute('u') === 'sng',
        fontSize: size ? Number.parseInt(size, 10) / 100 : undefined,
        fontFamily,
        fontColor: parseRgbColor(runProperties)
      };
    };

    const parseTextBody = (txBodyNode: Element): Paragraph[] => {
      const paragraphs: Paragraph[] = [];
      const paragraphNodes = txBodyNode.getElementsByTagName('a:p');

      for (const paragraphNode of paragraphNodes) {
        const paragraphProperties = paragraphNode.getElementsByTagName('a:pPr')[0];
        const defaultRunProperties = paragraphProperties?.getElementsByTagName('a:defRPr')[0];
        const runs: TextRun[] = [];

        for (const child of paragraphNode.children) {
          if (child.tagName === 'a:br') {
            runs.push(parseTextRun('\n', defaultRunProperties));
            continue;
          }
          if (child.tagName !== 'a:r' && child.tagName !== 'a:fld') continue;
          const textNode = child.getElementsByTagName('a:t')[0];
          if (!textNode) continue;
          const runProperties = child.getElementsByTagName('a:rPr')[0] || defaultRunProperties;
          runs.push(parseTextRun(textNode.textContent || '', runProperties));
        }

        if (runs.length > 0) {
          const bullet = paragraphProperties?.getElementsByTagName('a:buChar')[0]?.getAttribute('char') || undefined;
          const level = paragraphProperties?.getAttribute('lvl');
          paragraphs.push({
            runs,
            alignment: mapAlignment(paragraphProperties?.getAttribute('algn') || null),
            bullet,
            level: level ? Number.parseInt(level, 10) : undefined
          });
        }
      }
      return paragraphs;
    };

    const parseShape = (node: Element, id: string, geometry: ReturnType<typeof parseTransform>): ShapeElement | null => {
      const presetGeometry = node.getElementsByTagName('a:prstGeom')[0];
      if (!presetGeometry) return null;
      const shapeProperties = node.getElementsByTagName('p:spPr')[0];
      const lineProperties = shapeProperties?.getElementsByTagName('a:ln')[0];
      const lineWidth = lineProperties?.getAttribute('w');
      return {
        id,
        type: 'shape',
        ...geometry,
        zIndex: zIndex++,
        shapeType: presetGeometry.getAttribute('prst') || 'rect',
        fillColor: parseRgbColor(shapeProperties?.getElementsByTagName('a:solidFill')[0]),
        borderColor: parseRgbColor(lineProperties?.getElementsByTagName('a:solidFill')[0]),
        borderWidth: lineWidth ? Number.parseInt(lineWidth, 10) / 9_525 : undefined
      };
    };

    const backgroundProperties = doc.getElementsByTagName('p:bgPr')[0];
    const backgroundColor = parseRgbColor(backgroundProperties?.getElementsByTagName('a:solidFill')[0]);
    const background: SlideBackground | undefined = backgroundColor
      ? { type: 'solid', color: backgroundColor }
      : undefined;

    const shapeTree = doc.getElementsByTagName('p:spTree')[0];
    if (shapeTree) {
      for (const child of shapeTree.children) {
        if (child.tagName === 'p:sp' || child.tagName === 'p:cxnSp') {
          const id = child.getElementsByTagName('p:cNvPr')[0]?.getAttribute('id') || `shape_${zIndex}`;
          const transform = child.getElementsByTagName('a:xfrm')[0];
          if (!transform) continue;
          const geometry = parseTransform(transform);
          const shape = parseShape(child, `${id}_shape`, geometry);
          if (shape) elements.push(shape);

          const textBody = child.getElementsByTagName('p:txBody')[0];
          if (textBody) {
            const paragraphs = parseTextBody(textBody);
            if (paragraphs.length > 0) {
              const textElement: TextElement = {
                id: `${id}_text`,
                type: 'text',
                ...geometry,
                zIndex: zIndex++,
                paragraphs
              };
              elements.push(textElement);
            }
          }
        } else if (child.tagName === 'p:pic') {
          const id = child.getElementsByTagName('p:cNvPr')[0]?.getAttribute('id') || `picture_${zIndex}`;
          const transform = child.getElementsByTagName('a:xfrm')[0];
          if (!transform) continue;
          const geometry = parseTransform(transform);
          const embedId = child.getElementsByTagName('a:blip')[0]?.getAttribute('r:embed');
          const relationship = embedId ? rels.get(embedId) : undefined;

          if (relationship && relationship.targetMode !== 'External') {
            const url = await MediaParser.extractMedia(zipReader, slidePath, relationship.target);
            if (url) {
              const imageElement: ImageElement = {
                id,
                type: 'image',
                ...geometry,
                zIndex: zIndex++,
                url
              };
              elements.push(imageElement);
            }
          }
        }
      }
    }

    return {
      id: slideId,
      index: slideIndex,
      background,
      elements
    };
  }
}
