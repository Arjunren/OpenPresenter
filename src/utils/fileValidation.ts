export class PresentationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'PresentationError';
    this.code = code;
  }
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function hasZipSignature(header: Uint8Array): boolean {
  return header.length >= 4
    && header[0] === 0x50
    && header[1] === 0x4b
    && ((header[2] === 0x03 && header[3] === 0x04)
      || (header[2] === 0x05 && header[3] === 0x06)
      || (header[2] === 0x07 && header[3] === 0x08));
}

export async function validatePptxFile(file: File): Promise<void> {
  if (file.size === 0) {
    throw new PresentationError('The selected file is empty.', 'EMPTY_FILE');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new PresentationError('File exceeds 50MB limit.', 'FILE_TOO_LARGE');
  }

  if (!file.name.toLowerCase().endsWith('.pptx')) {
    throw new PresentationError('Only .pptx files are supported.', 'INVALID_EXTENSION');
  }

  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  if (!hasZipSignature(header)) {
    throw new PresentationError('The selected file is not a valid PPTX archive.', 'INVALID_ARCHIVE');
  }
}
