// ── Content blocks ──────────────────────────────────────────────────────────
export type HeadingBlock = {
  type: "heading";
  id: string;
  level: 1 | 2 | 3;
  text: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  id: string;
  text: string;
};

export type ImageBlock = {
  type: "image";
  id: string;
  url: string;
  alt?: string;
  caption?: string;
};

export type SpecsBlock = {
  type: "specs";
  id: string;
  rows: { label: string; value: string }[];
};

export type DividerBlock = {
  type: "divider";
  id: string;
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | SpecsBlock
  | DividerBlock;

// ── Products ─────────────────────────────────────────────────────────────────
export type HomeProduct = {
  id: string;
  slug: string | null;
  badge: string | null;
  badgeColor: string;
  title: string;
  titleColor: string;
  desc: string;
  descColor: string;
  btn1Color: string;
  btn1BgColor: string;
  btn2Color: string;
  btn2BgColor: string;
  imgUrl: string;
  backgroundColor: string;
  placement: "SHOWCASE" | "GRID";
  hasContent: boolean;
  categories: { id: number; slug: string; name: string }[];
};

export type AdminProduct = {
  id: string;
  placement: "SHOWCASE" | "GRID";
  sortOrder: number;
  badgeColor: string;
  titleColor: string;
  descColor: string;
  btn1Color: string;
  btn1BgColor: string;
  btn2Color: string;
  btn2BgColor: string;
  imgUrl: string;
  backgroundColor: string;
  categories: { id: number }[];
  translations: {
    locale: string;
    badge: string | null;
    title: string;
    desc: string;
  }[];
};
