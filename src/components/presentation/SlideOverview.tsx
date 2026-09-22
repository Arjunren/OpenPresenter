import { X } from 'lucide-react';
import type { Presentation } from '../../models/Presentation';
import { SlideCanvas } from '../slides/SlideCanvas';

interface SlideOverviewProps {
  presentation: Presentation;
  currentSlideIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export const SlideOverview = ({
  presentation,
  currentSlideIndex,
  onSelect,
  onClose
}: SlideOverviewProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Slide overview"
      className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/95 p-4 text-white sm:p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Slide overview</h2>
            <p className="text-sm text-slate-400">Choose a slide to open it</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close slide overview"
            className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentation.slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => onSelect(index)}
              aria-label={`Open slide ${index + 1}`}
              aria-current={index === currentSlideIndex ? 'page' : undefined}
              className={`overflow-hidden rounded-md border-2 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                index === currentSlideIndex
                  ? 'border-blue-500 ring-2 ring-blue-500/40'
                  : 'border-slate-700 hover:border-slate-400'
              }`}
            >
              <SlideCanvas slide={slide} aspectRatio={presentation.aspectRatio} slideWidth={presentation.width} />
              <span className="block bg-slate-900 px-3 py-2 text-sm text-slate-300">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
