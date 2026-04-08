export type HeroSlideTranslation = {
  locale: string;
  eyebrow: string;
  headline: string;
  subline: string;
};

export type HeroSlide = {
  id: number;
  videoSrc: string;
  eyebrowColor: string;
  headlineColor: string;
  sublineColor: string;
  translations: HeroSlideTranslation[];
};

export type PublicHeroSlide = {
  id: number;
  videoSrc: string;
  eyebrowColor: string;
  headlineColor: string;
  sublineColor: string;
  eyebrow: string;
  headline: string;
  subline: string;
};
