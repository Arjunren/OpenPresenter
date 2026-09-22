import type { BaseSlideElement } from './SlideElement';

export interface TextRun {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
}

export interface Paragraph {
  runs: TextRun[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  bullet?: string;
  level?: number;
}

export interface TextElement extends BaseSlideElement {
  type: 'text';
  paragraphs: Paragraph[];
}
