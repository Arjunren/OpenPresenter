import { useState } from 'react';
import type { Presentation } from '../../models/Presentation';
import { SlideCanvas } from '../slides/SlideCanvas';
import { ChevronLeft, ChevronRight, Grid2X2, PanelLeftClose, PanelLeftOpen, Play } from 'lucide-react';
import { SlideOverview } from './SlideOverview';

interface PresentationWorkspaceProps {
  presentation: Presentation;
  onPresent: () => void;
}

export const PresentationWorkspace = ({ presentation, onPresent }: PresentationWorkspaceProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const currentSlide = presentation.slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
      <aside className="hidden w-64 bg-white border-r border-slate-200 md:flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-200 font-semibold text-slate-700 bg-slate-50 sticky top-0 z-10 flex justify-between items-center">
          <span>Slides ({presentation.slides.length})</span>
        </div>
        <div className="flex flex-col p-4 gap-4">
          {presentation.slides.map((slide, idx) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Open slide ${idx + 1}`}
              aria-current={idx === currentSlideIndex ? 'page' : undefined}
              className={`w-full text-left cursor-pointer rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 ${
                idx === currentSlideIndex 
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-200' 
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-slate-500 mb-1 px-1">{idx + 1}</div>
              <div className="bg-white pointer-events-none origin-top-left" style={{ transform: 'scale(1)', width: '100%' }}>
                 <SlideCanvas slide={slide} aspectRatio={presentation.aspectRatio} slideWidth={presentation.width} />
              </div>
            </button>
          ))}
        </div>
      </aside>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="hidden rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:block"
              aria-label={sidebarOpen ? 'Hide slide sidebar' : 'Show slide sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <span className="max-w-36 truncate font-medium text-slate-700 sm:max-w-sm">{presentation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOverviewOpen(true)}
              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Open slide overview"
            >
              <Grid2X2 size={19} />
            </button>
            <button 
              type="button"
              onClick={onPresent}
              aria-label="Start presentation"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Play size={16} /> <span className="hidden sm:inline">Present</span>
            </button>
          </div>
        </header>

        {/* Slide Viewer */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-100">
          <div className="w-full max-w-4xl shadow-2xl ring-1 ring-slate-200/50 rounded-sm">
            {currentSlide ? (
              <SlideCanvas slide={currentSlide} aspectRatio={presentation.aspectRatio} slideWidth={presentation.width} />
            ) : (
              <div className="w-full aspect-video bg-white flex items-center justify-center text-slate-400">
                No slide available
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <footer className="h-14 bg-white border-t border-slate-200 flex items-center justify-center gap-6 shrink-0">
          <button 
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            aria-label="Previous slide"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <span className="text-sm font-medium text-slate-600 w-24 text-center">
            Slide {currentSlideIndex + 1} of {presentation.slides.length}
          </span>
          
          <button 
            onClick={handleNext}
            disabled={currentSlideIndex === presentation.slides.length - 1}
            aria-label="Next slide"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </footer>
      </main>

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
