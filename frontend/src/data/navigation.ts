export type NavKey =
  | "store"
  | "phones"
  | "laptops"
  | "tablets"
  | "wearables"
  | "accessories"
  | "support"
  | "aboutUs"
  | "contactUs"
  | "ourLocation";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "aboutUs", href: "/about-us" },
  { key: "contactUs", href: "/#contact-us" },
  { key: "ourLocation", href: "/#our-location" },
];

export type FooterColumnKey = "shop" | "services" | "company" | "support";

export type FooterLinkKey =
  | "allProducts"
  | "phones"
  | "laptops"
  | "tablets"
  | "wearables"
  | "accessories"
  | "care"
  | "tradeIn"
  | "financing"
  | "business"
  | "about"
  | "careers"
  | "press"
  | "sustainability"
  | "contact"
  | "findStore"
  | "repair"
  | "returns";

export type FooterColumn = {
  headingKey: FooterColumnKey;
  links: { key: FooterLinkKey; href: string }[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    headingKey: "shop",
    links: [
      { key: "allProducts", href: "/store" },
      { key: "phones", href: "/phones" },
      { key: "laptops", href: "/laptops" },
      { key: "tablets", href: "/tablets" },
      { key: "wearables", href: "/wearables" },
      { key: "accessories", href: "/accessories" },
    ],
  },
  {
    headingKey: "services",
    links: [
      { key: "care", href: "/care" },
      { key: "tradeIn", href: "/trade-in" },
      { key: "financing", href: "/financing" },
      { key: "business", href: "/business" },
    ],
  },
  {
    headingKey: "company",
    links: [
      { key: "about", href: "/about" },
      { key: "careers", href: "/careers" },
      { key: "press", href: "/press" },
      { key: "sustainability", href: "/sustainability" },
    ],
  },
  {
    headingKey: "support",
    links: [
      { key: "contact", href: "/contact" },
      { key: "findStore", href: "/stores" },
      { key: "repair", href: "/repair" },
      { key: "returns", href: "/returns" },
    ],
  },
];
