import { useState, useEffect, useRef, useCallback } from 'react';
import type { Presentation } from '../../models/Presentation';
import { SlideCanvas } from '../slides/SlideCanvas';
import { PresentationToolbar } from './PresentationToolbar';
import { SlideOverview } from './SlideOverview';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface PresentationModeProps {
  presentation: Presentation;
  onExit: () => void;
}

export const PresentationMode = ({ presentation, onExit }: PresentationModeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, presentation.slides.length - 1));
  }, [presentation.slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleFirst = useCallback(() => setCurrentSlideIndex(0), []);

  const handleLast = useCallback(() => {
    setCurrentSlideIndex(Math.max(presentation.slides.length - 1, 0));
  }, [presentation.slides.length]);

  const handleExit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    onExit();
  }, [onExit]);

  useKeyboardNavigation(
    handleNext,
    handlePrev,
    handleExit,
    toggleFullscreen,
    handleFirst,
    handleLast
  );

  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 w-full h-full bg-black z-50 flex items-center justify-center ${
        !controlsVisible ? 'cursor-none' : 'cursor-default'
      }`}
    >
      <div 
        className="w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center p-0 transition-transform duration-300"
      >
        <div className="relative w-full h-full flex items-center justify-center">
           <div
             className="flex justify-center"
             style={{
               width: `min(100vw, calc(100vh * ${presentation.aspectRatio}))`,
               aspectRatio: presentation.aspectRatio
             }}
           >
              <SlideCanvas slide={currentSlide} aspectRatio={presentation.aspectRatio} slideWidth={presentation.width} />
           </div>
        </div>
      </div>

      <PresentationToolbar 
        currentSlide={currentSlideIndex + 1}
        totalSlides={presentation.slides.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={handleExit}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOverview={() => setOverviewOpen(true)}
        visible={controlsVisible}
      />

      {overviewOpen && (
        <SlideOverview
          presentation={presentation}
          currentSlideIndex={currentSlideIndex}
          onSelect={(index) => {
            setCurrentSlideIndex(index);
            setOverviewOpen(false);
          }}
          onClose={() => setOverviewOpen(false)}
        />
      )}
    </div>
  );
};
