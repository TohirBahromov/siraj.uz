export type CategoryTranslation = {
  locale: string;
  name: string;
  slug: string;
};

/** Flat category as returned by the admin API */
export type AdminCategory = {
  id: number;
  slug: string;
  imgUrl: string;
  parentId: number | null;
  level: number;
  translations: CategoryTranslation[];
  children?: AdminCategory[];
};

/** Recursive node used in the public category tree */
export type PublicCategoryNode = {
  id: number;
  slug: string;
  name: string;
  imgUrl: string;
  children: PublicCategoryNode[];
};

/** Category detail page response */
export type PublicCategoryDetail = {
  id: number;
  slug: string;
  name: string;
  imgUrl: string;
  children: { id: number; slug: string; name: string; imgUrl: string }[];
  products: {
    id: number;
    slug: string;
    title: string;
    badge: string | null;
    imgUrl: string;
    badgeColor: string;
    titleColor: string;
  }[];
};

/** Full product detail returned by /api/products/:slugId */
export type PublicProductDetail = {
  id: number;
  slug: string;
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
  categories: { id: number; slug: string; name: string }[];
};
