import type { ImageElement } from '../../models/ImageElement';

interface ImageRendererProps {
  element: ImageElement;
}

export const ImageRenderer = ({ element }: ImageRendererProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
        zIndex: element.zIndex,
        opacity: element.opacity !== undefined ? element.opacity : 1,
        pointerEvents: 'none',
      }}
    >
      <img 
        src={element.url} 
        alt="" 
        style={{ width: '100%', height: '100%', objectFit: 'fill' }} 
      />
    </div>
  );
};
