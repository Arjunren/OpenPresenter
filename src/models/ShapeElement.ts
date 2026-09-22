import type { BaseSlideElement } from './SlideElement';

export interface ShapeElement extends BaseSlideElement {
  type: 'shape';
  shapeType: 'rect' | 'ellipse' | 'line' | 'triangle' | string;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
}
