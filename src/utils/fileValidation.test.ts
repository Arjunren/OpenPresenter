import { describe, expect, it } from 'vitest';
import { MAX_FILE_SIZE, PresentationError, validatePptxFile } from './fileValidation';
import { createPptxFixture } from '../test/pptxFixture';

describe('validatePptxFile', () => {
  it('accepts a PPTX file with a ZIP signature', async () => {
    await expect(validatePptxFile(await createPptxFixture())).resolves.toBeUndefined();
  });

  it('rejects unsupported extensions', async () => {
    const file = await createPptxFixture({ name: 'slides.ppt' });
    await expect(validatePptxFile(file)).rejects.toMatchObject<Partial<PresentationError>>({
      code: 'INVALID_EXTENSION'
    });
  });

  it('rejects empty and disguised non-ZIP files', async () => {
    await expect(validatePptxFile(new File([], 'empty.pptx'))).rejects.toMatchObject({ code: 'EMPTY_FILE' });
    await expect(validatePptxFile(new File(['not a zip'], 'fake.pptx'))).rejects.toMatchObject({ code: 'INVALID_ARCHIVE' });
  });

  it('rejects files above the configured limit before reading them', async () => {
    const oversized = { name: 'large.pptx', size: MAX_FILE_SIZE + 1 } as File;
    await expect(validatePptxFile(oversized)).rejects.toMatchObject({ code: 'FILE_TOO_LARGE' });
  });
});
