import type { Slide } from './Slide';
import type { PresentationTheme } from './Theme';

export interface PresentationMetadata {
  title?: string;
  author?: string;
  revision?: string;
}

export interface Presentation {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  slides: Slide[];
  theme?: PresentationTheme;
  metadata?: PresentationMetadata;
}
