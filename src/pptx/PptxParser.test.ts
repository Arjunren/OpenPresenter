import JSZip from 'jszip';
import { describe, expect, it, vi } from 'vitest';
import { PptxParser } from './PptxParser';
import type { ImageElement } from '../models/ImageElement';
import type { ShapeElement } from '../models/ShapeElement';
import type { TextElement } from '../models/TextElement';
import { createPptxFixture } from '../test/pptxFixture';

describe('PptxParser', () => {
  it('parses slide order, dimensions, styled text, shapes, backgrounds, and images', async () => {
    const updateStage = vi.fn();
    const presentation = await PptxParser.parse(await createPptxFixture(), updateStage);

    expect(presentation.slides).toHaveLength(2);
    expect(presentation.aspectRatio).toBeCloseTo(16 / 9, 4);
    expect(presentation.slides[0].background).toEqual({ type: 'solid', color: 'F8FAFC' });

    const shape = presentation.slides[0].elements.find((element) => element.type === 'shape') as ShapeElement;
    expect(shape).toMatchObject({ shapeType: 'roundRect', fillColor: '2563EB', borderColor: '1E3A8A' });
    expect(shape.rotation).toBe(1);

    const text = presentation.slides[0].elements.find((element) => element.type === 'text') as TextElement;
    expect(text.paragraphs[0]).toMatchObject({ alignment: 'center', bullet: '•' });
    expect(text.paragraphs[0].runs[0]).toMatchObject({
      text: 'Hello OpenPresenter',
      fontFamily: 'Aptos',
      fontSize: 24,
      fontColor: 'FFFFFF',
      isBold: true,
      isItalic: true,
      isUnderline: true
    });
    expect(text.paragraphs[0].runs[1]).toMatchObject({
      text: ' with multiple fonts',
      fontFamily: 'Georgia',
      fontSize: 18,
      fontColor: 'DBEAFE'
    });

    const image = presentation.slides[0].elements.find((element) => element.type === 'image') as ImageElement;
    expect(image.url).toBe('blob:openpresenter-test');
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(updateStage).toHaveBeenCalledWith('Processing slide 2 of 2...');
  });

  it('parses an image-heavy slide without dropping media elements', async () => {
    const presentation = await PptxParser.parse(
      await createPptxFixture({ imageCount: 24 }),
      vi.fn()
    );
    const images = presentation.slides[0].elements.filter((element) => element.type === 'image');

    expect(images).toHaveLength(24);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(24);
  });

  it('preserves a 4:3 slide aspect ratio', async () => {
    const presentation = await PptxParser.parse(
      await createPptxFixture({ width: 9_144_000, height: 6_858_000 }),
      vi.fn()
    );
    expect(presentation.aspectRatio).toBeCloseTo(4 / 3, 5);
  });

  it('keeps the presentation usable when one slide is malformed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const presentation = await PptxParser.parse(
      await createPptxFixture({ malformedFirstSlide: true }),
      vi.fn()
    );
    expect(presentation.slides).toHaveLength(2);
    expect(presentation.slides[0].elements).toEqual([]);
    expect(presentation.slides[1].index).toBe(1);
  });

  it('rejects ZIP files that are not PPTX packages', async () => {
    const zip = new JSZip();
    zip.file('unrelated.txt', 'not a presentation');
    const bytes = await zip.generateAsync({ type: 'uint8array' });
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    const file = new File([buffer], 'broken.pptx');

    await expect(PptxParser.parse(file, vi.fn())).rejects.toMatchObject({
      code: 'INVALID_PPTX_STRUCTURE'
    });
  });
});
