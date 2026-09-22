import { describe, expect, it } from 'vitest';
import { resolveArchivePath } from './paths';

describe('resolveArchivePath', () => {
  it('resolves relationship targets relative to their source part', () => {
    expect(resolveArchivePath('ppt/presentation.xml', 'slides/slide1.xml')).toBe('ppt/slides/slide1.xml');
    expect(resolveArchivePath('ppt/slides/slide1.xml', '../media/image1.png')).toBe('ppt/media/image1.png');
    expect(resolveArchivePath('ppt/slides/slide1.xml', '/ppt/media/image1.png')).toBe('ppt/media/image1.png');
  });

  it('rejects paths that escape the package root', () => {
    expect(() => resolveArchivePath('ppt/presentation.xml', '../../outside.xml')).toThrow(/escapes/);
  });
});
