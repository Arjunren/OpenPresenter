import type { BaseSlideElement } from './SlideElement';

export interface SlideBackground {
  type: 'solid' | 'image';
  color?: string;
  imageUrl?: string;
}

export interface SlideTransition {
  type: string;
}

export interface Slide {
  id: string;
  index: number;
  background?: SlideBackground;
  elements: BaseSlideElement[];
  notes?: string;
  transition?: SlideTransition;
}
