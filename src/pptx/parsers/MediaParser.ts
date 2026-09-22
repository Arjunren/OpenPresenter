import { ZipReader } from '../ZipReader';
import { resolveArchivePath } from '../utils/paths';

export class MediaParser {
  static async extractMedia(zipReader: ZipReader, sourcePath: string, target: string): Promise<string | null> {
    const absolutePath = resolveArchivePath(sourcePath, target);

    const ext = absolutePath.split('.').pop()?.toLowerCase();
    let mime = 'application/octet-stream';
    if (ext === 'png') mime = 'image/png';
    else if (ext === 'jpeg' || ext === 'jpg') mime = 'image/jpeg';
    else if (ext === 'gif') mime = 'image/gif';
    else if (ext === 'svg') mime = 'image/svg+xml';

    const blob = await zipReader.getFileBlob(absolutePath, mime);
    if (!blob) return null;
    
    return URL.createObjectURL(blob);
  }
}
