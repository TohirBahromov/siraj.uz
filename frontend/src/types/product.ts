export type HomeProduct = {
  id: string;
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
  translations: {
    locale: string;
    badge: string | null;
    title: string;
    desc: string;
  }[];
};
