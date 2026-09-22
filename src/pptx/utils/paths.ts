export function resolveArchivePath(baseFilePath: string, target: string): string {
  const normalizedTarget = target.replace(/\\/g, '/');
  const baseDirectory = baseFilePath.slice(0, baseFilePath.lastIndexOf('/') + 1);
  const source = normalizedTarget.startsWith('/')
    ? normalizedTarget.slice(1)
    : `${baseDirectory}${normalizedTarget}`;
  const resolved: string[] = [];

  for (const segment of source.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (resolved.length === 0) {
        throw new Error(`Relationship target escapes the PPTX archive: ${target}`);
      }
      resolved.pop();
      continue;
    }
    resolved.push(segment);
  }

  return resolved.join('/');
}
