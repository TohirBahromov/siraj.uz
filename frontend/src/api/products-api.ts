import "server-only";
import type { HomeProduct } from "@/types/product";

function getApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

export async function fetchHomeProducts(
  placement: "SHOWCASE" | "GRID",
  locale: string,
): Promise<HomeProduct[]> {
  const base = getApiBase();
  const url = `${base}/products?placement=${placement}&locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(
      `Failed to load products (${placement}): ${res.status} ${res.statusText}`,
    );
  }
  return res.json() as Promise<HomeProduct[]>;
}
