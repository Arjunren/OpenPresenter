import type { BaseSlideElement } from '../../models/SlideElement';
import { TextRenderer } from '../renderers/TextRenderer';
import { ImageRenderer } from '../renderers/ImageRenderer';
import { ShapeRenderer } from '../renderers/ShapeRenderer';
import type { TextElement } from '../../models/TextElement';
import type { ImageElement } from '../../models/ImageElement';
import type { ShapeElement } from '../../models/ShapeElement';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface SlideElementRendererProps {
  element: BaseSlideElement;
  slideWidth: number;
}

export const SlideElementRenderer = ({ element, slideWidth }: SlideElementRendererProps) => {
  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <TextRenderer element={element as TextElement} slideWidth={slideWidth} />;
      case 'image':
        return <ImageRenderer element={element as ImageElement} />;
      case 'shape':
        return <ShapeRenderer element={element as ShapeElement} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      {renderElement()}
    </ErrorBoundary>
  );
};
