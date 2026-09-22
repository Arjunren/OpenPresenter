import type { Slide } from '../../models/Slide';
import { SlideElementRenderer } from './SlideElementRenderer';

interface SlideCanvasProps {
  slide: Slide;
  aspectRatio: number;
  slideWidth: number;
}

export const SlideCanvas = ({ slide, aspectRatio, slideWidth }: SlideCanvasProps) => {
  return (
    <div 
      className="relative w-full overflow-hidden bg-white shadow-md border border-slate-200"
      style={{ aspectRatio: `${aspectRatio}`, containerType: 'inline-size' }}
    >
      {/* Background Layer */}
      {slide.background?.type === 'solid' && (
        <div 
          className="absolute inset-0 z-0" 
          style={{ backgroundColor: slide.background.color ? `#${slide.background.color}` : 'white' }} 
        />
      )}

      {/* Elements Layer */}
      {slide.elements.map(el => (
        <SlideElementRenderer key={el.id} element={el} slideWidth={slideWidth} />
      ))}
    </div>
  );
};
