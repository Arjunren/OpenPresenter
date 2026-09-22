import { useEffect } from 'react';

export function useKeyboardNavigation(
  onNext: () => void,
  onPrev: () => void,
  onExit: () => void,
  onToggleFullscreen?: () => void,
  onFirst?: () => void,
  onLast?: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
        case 'PageDown':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          onPrev();
          break;
        case 'Home':
          if (onFirst) {
            e.preventDefault();
            onFirst();
          }
          break;
        case 'End':
          if (onLast) {
            e.preventDefault();
            onLast();
          }
          break;
        case 'Escape':
          onExit();
          break;
        case 'f':
        case 'F':
          if (onToggleFullscreen) {
            e.preventDefault();
            onToggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, onExit, onToggleFullscreen, onFirst, onLast]);
}
