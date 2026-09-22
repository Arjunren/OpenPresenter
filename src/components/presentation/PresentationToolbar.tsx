import { ChevronLeft, ChevronRight, Grid2X2, X, Maximize, Minimize } from 'lucide-react';

interface PresentationToolbarProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOverview: () => void;
  visible: boolean;
}

export const PresentationToolbar = ({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onExit,
  isFullscreen,
  onToggleFullscreen,
  onOverview,
  visible
}: PresentationToolbarProps) => {
  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <button 
        onClick={onPrev} 
        disabled={currentSlide === 1}
        aria-label="Previous slide"
        className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <span className="font-medium text-sm tabular-nums w-16 text-center">
        {currentSlide} / {totalSlides}
      </span>
      
      <button 
        onClick={onNext} 
        disabled={currentSlide === totalSlides}
        aria-label="Next slide"
        className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="w-px h-6 bg-white/20 mx-2" />

      <button
        onClick={onOverview}
        aria-label="Open slide overview"
        className="p-2 hover:bg-white/20 rounded-full transition-colors"
        title="Slide overview"
      >
        <Grid2X2 size={20} />
      </button>

      <button 
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="p-2 hover:bg-white/20 rounded-full transition-colors"
        title="Fullscreen (F)"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <button 
        onClick={onExit}
        aria-label="Exit presentation"
        className="p-2 hover:bg-red-500/80 hover:text-white rounded-full transition-colors text-slate-300"
        title="Exit (Esc)"
      >
        <X size={20} />
      </button>
    </div>
  );
};
