import { ZipReader } from './ZipReader';
import { PresentationParser } from './parsers/PresentationParser';
import { RelationshipParser } from './parsers/RelationshipParser';
import { SlideParser } from './parsers/SlideParser';
import { resolveArchivePath } from './utils/paths';
import type { Presentation } from '../models/Presentation';
import type { Slide } from '../models/Slide';

export class PptxParser {
  static async parse(file: File, updateStage: (stage: string) => void): Promise<Presentation> {
    updateStage('Extracting presentation...');
    const zipReader = await ZipReader.create(file);

    updateStage('Reading presentation structure...');
    const presConfig = await PresentationParser.parsePresentation(zipReader);
    
    // Read root presentation relationships
    const presRels = await RelationshipParser.parseRels(zipReader, 'ppt/_rels/presentation.xml.rels');

    const slides: Slide[] = [];
    const slideCount = presConfig.slideRefs.length;

    for (let i = 0; i < slideCount; i++) {
      updateStage(`Processing slide ${i + 1} of ${slideCount}...`);
      const ref = presConfig.slideRefs[i];
      const rel = presRels.get(ref.relId);
      
      if (rel && rel.targetMode !== 'External') {
        const slidePath = resolveArchivePath('ppt/presentation.xml', rel.target);

        try {
          const slide = await SlideParser.parseSlide(
            zipReader, 
            slidePath, 
            ref.id, 
            i, 
            presConfig.width, 
            presConfig.height
          );
          slides.push(slide);
        } catch (err) {
          console.error(`Failed to parse slide ${i + 1}:`, err);
          // Fallback empty slide
          slides.push({
            id: ref.id,
            index: i,
            elements: []
          });
        }
      } else {
        console.warn(`Missing or external relationship for slide ${i + 1}`);
        slides.push({
          id: ref.id,
          index: i,
          elements: []
        });
      }
    }

    updateStage('Building presentation...');

    return {
      id: file.name,
      name: file.name,
      width: presConfig.width,
      height: presConfig.height,
      aspectRatio: presConfig.width / presConfig.height,
      slides
    };
  }
}
