import JSZip from 'jszip';
import { PresentationError } from '../utils/fileValidation';

const MAX_ZIP_ENTRIES = 10_000;
const MAX_ENTRY_SIZE = 100 * 1024 * 1024;
const MAX_UNCOMPRESSED_SIZE = 500 * 1024 * 1024;

interface ZipEntryData {
  uncompressedSize?: number;
}

export class ZipReader {
  private zip: JSZip;

  constructor(zip: JSZip) {
    this.zip = zip;
  }

  static async create(file: File): Promise<ZipReader> {
    try {
      const buffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const entries = Object.values(zip.files);
      if (entries.length > MAX_ZIP_ENTRIES) {
        throw new PresentationError('The PPTX archive contains too many entries.', 'ZIP_LIMIT_EXCEEDED');
      }

      let totalUncompressedSize = 0;
      for (const entry of entries) {
        if (entry.unsafeOriginalName?.split(/[\\/]/).includes('..')) {
          throw new PresentationError('The PPTX archive contains an unsafe path.', 'UNSAFE_ARCHIVE_PATH');
        }

        const data = (entry as unknown as { _data?: ZipEntryData })._data;
        const entrySize = data?.uncompressedSize ?? 0;
        if (entrySize > MAX_ENTRY_SIZE) {
          throw new PresentationError('The PPTX archive contains an oversized entry.', 'ZIP_LIMIT_EXCEEDED');
        }
        totalUncompressedSize += entrySize;
      }

      if (totalUncompressedSize > MAX_UNCOMPRESSED_SIZE) {
        throw new PresentationError('The expanded PPTX archive is too large.', 'ZIP_LIMIT_EXCEEDED');
      }

      if (!zip.file('[Content_Types].xml') || !zip.file('ppt/presentation.xml')) {
        throw new PresentationError('The archive is missing required PPTX files.', 'INVALID_PPTX_STRUCTURE');
      }

      return new ZipReader(zip);
    } catch (error: unknown) {
      if (error instanceof PresentationError) throw error;
      const message = error instanceof Error ? error.message : 'Unknown archive error';
      throw new PresentationError(`Failed to parse ZIP archive: ${message}`, 'ZIP_ERROR');
    }
  }

  async getFileText(path: string): Promise<string | null> {
    const file = this.zip.file(path);
    if (!file) return null;
    return await file.async('text');
  }

  async getFileBlob(path: string, mimeType: string = 'application/octet-stream'): Promise<Blob | null> {
    const file = this.zip.file(path);
    if (!file) return null;
    const arrayBuffer = await file.async('arraybuffer');
    return new Blob([arrayBuffer], { type: mimeType });
  }

  hasFile(path: string): boolean {
    return this.zip.file(path) !== null;
  }
}
