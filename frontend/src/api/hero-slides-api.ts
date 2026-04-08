import "server-only";
import type { PublicHeroSlide } from "@/types/hero-slide";

function getApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

export async function fetchHeroSlides(
  locale: string,
): Promise<PublicHeroSlide[]> {
  const base = getApiBase();
  const url = `${base}/hero-slides?lang=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(
      `Failed to load hero slides: ${res.status} ${res.statusText}`,
    );
  }
  return res.json() as Promise<PublicHeroSlide[]>;
}
