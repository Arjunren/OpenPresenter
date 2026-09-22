import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TextElement } from '../../models/TextElement';
import { TextRenderer } from './TextRenderer';

describe('TextRenderer', () => {
  it('scales PowerPoint point sizes with the slide container width', () => {
    const element: TextElement = {
      id: 'text-1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 25,
      zIndex: 1,
      paragraphs: [{ runs: [{ text: 'Responsive text', fontSize: 36 }] }]
    };

    render(<TextRenderer element={element} slideWidth={9_144_000} />);

    expect(screen.getByText('Responsive text').style.fontSize).toContain('cqw');
    expect(screen.getByText('Responsive text').style.fontSize).toContain('5');
  });
});
