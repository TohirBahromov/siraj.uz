export type HeadingBlock = {
  type: 'heading';
  id: string;
  level: 1 | 2 | 3;
  text: string;
};

export type ParagraphBlock = {
  type: 'paragraph';
  id: string;
  text: string;
};

export type ImageBlock = {
  type: 'image';
  id: string;
  url: string;
  alt?: string;
  caption?: string;
};

export type SpecsBlock = {
  type: 'specs';
  id: string;
  rows: { label: string; value: string }[];
};

export type DividerBlock = {
  type: 'divider';
  id: string;
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | SpecsBlock
  | DividerBlock;
