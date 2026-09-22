import { parseXml } from '../utils/xml';
import { ZipReader } from '../ZipReader';

export interface Relationship {
  id: string;
  type: string;
  target: string;
  targetMode?: string;
}

export class RelationshipParser {
  static async parseRels(zipReader: ZipReader, relsPath: string): Promise<Map<string, Relationship>> {
    const xml = await zipReader.getFileText(relsPath);
    const relsMap = new Map<string, Relationship>();
    if (!xml) return relsMap;

    const doc = parseXml(xml);
    const relNodes = doc.getElementsByTagName('Relationship');

    for (let i = 0; i < relNodes.length; i++) {
      const node = relNodes[i];
      const id = node.getAttribute('Id');
      const type = node.getAttribute('Type');
      const target = node.getAttribute('Target');
      const targetMode = node.getAttribute('TargetMode');

      if (id && type && target) {
        relsMap.set(id, {
          id,
          type,
          target,
          targetMode: targetMode || 'Internal'
        });
      }
    }

    return relsMap;
  }
}
