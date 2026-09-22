import type { BaseSlideElement } from './SlideElement';

export interface ImageElement extends BaseSlideElement {
  type: 'image';
  url: string; // Blob URL
  originalWidth?: number;
  originalHeight?: number;
}
