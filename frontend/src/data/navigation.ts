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

export type FooterColumnKey = "catalogue" | "company" | "support";

export type FooterLinkKey =
  | "categories"
  | "aboutUs"
  | "contactUs"
  | "ourLocation"
  | "contact"
  | "repair"
  | "returns"
  | "faq";

export type FooterColumn = {
  headingKey: FooterColumnKey;
  links: { key: FooterLinkKey; href: string }[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    headingKey: "catalogue",
    links: [
      { key: "categories", href: "/categories" },
    ],
  },
  {
    headingKey: "company",
    links: [
      { key: "aboutUs", href: "/about-us" },
      { key: "contactUs", href: "/#contact-us" },
      { key: "ourLocation", href: "/#our-location" },
    ],
  },
  {
    headingKey: "support",
    links: [
      { key: "contact", href: "/#contact-us" },
      { key: "repair", href: "/#contact-us" },
      { key: "returns", href: "/#contact-us" },
      { key: "faq", href: "/#contact-us" },
    ],
  },
];
