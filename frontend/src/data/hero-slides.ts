/** Visual config for each hero slide. Text lives in dictionaries. */
export type HeroSlideConfig = {
  id: number;
  videoSrc: string;
  eyebrowColor: string;
  headlineColor: string;
  sublineColor: string;
};

export const HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 1,
    videoSrc: "/videos/slide-1.mp4",
    eyebrowColor: "#e9d5ff",
    headlineColor: "#ffffff",
    sublineColor: "#ffffff99",
  },
  {
    id: 2,
    videoSrc: "/videos/slide-2.mp4",
    eyebrowColor: "#fde68a",
    headlineColor: "#ffffff",
    sublineColor: "#ffffff99",
  },
  {
    id: 3,
    videoSrc: "/videos/slide-3.mp4",
    eyebrowColor: "#a7f3d0",
    headlineColor: "#ffffff",
    sublineColor: "#ffffff99",
  },
];
