import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Presentation } from '../../models/Presentation';
import { PresentationMode } from './PresentationMode';

const presentation: Presentation = {
  id: 'keyboard-test',
  name: 'keyboard-test.pptx',
  width: 9_144_000,
  height: 5_143_500,
  aspectRatio: 16 / 9,
  slides: [
    { id: 'slide-1', index: 0, elements: [] },
    { id: 'slide-2', index: 1, elements: [] }
  ]
};

describe('PresentationMode', () => {
  it('supports next, previous, first, last, and exit keyboard controls', () => {
    const onExit = vi.fn();
    render(<PresentationMode presentation={presentation} onExit={onExit} />);

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Home' });
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'PageUp' });
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('exposes accessible controls and a ratio-preserving viewport', () => {
    const { container } = render(<PresentationMode presentation={presentation} onExit={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open slide overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Exit presentation' })).toBeInTheDocument();
    expect(container.querySelector('[style*="min(100vw"]')).toHaveStyle({ aspectRatio: String(16 / 9) });
  });

  it('opens the slide overview and navigates from it', () => {
    render(<PresentationMode presentation={presentation} onExit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open slide overview' }));
    expect(screen.getByRole('dialog', { name: 'Slide overview' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open slide 2' }));
    expect(screen.queryByRole('dialog', { name: 'Slide overview' })).not.toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});
