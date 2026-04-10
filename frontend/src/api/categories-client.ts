import type { PublicCategoryNode } from "@/types/category";
import type { HomeProduct } from "@/types/product";

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
}

export async function fetchCategoryTreeClient(
  locale: string,
): Promise<PublicCategoryNode[]> {
  const base = getApiBase();
  const res = await fetch(
    `${base}/categories?locale=${encodeURIComponent(locale)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json() as Promise<PublicCategoryNode[]>;
}

export type CategoryProductsPage = {
  products: HomeProduct[];
  nextCursor: number | null;
};

export async function fetchCategoryProductsClient(
  slug: string,
  locale: string,
  cursor?: number,
): Promise<CategoryProductsPage> {
  const base = getApiBase();
  let url = `${base}/categories/${encodeURIComponent(slug)}/products?locale=${encodeURIComponent(locale)}&limit=10`;
  if (cursor) url += `&cursor=${cursor}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { products: [], nextCursor: null };
  return res.json() as Promise<CategoryProductsPage>;
}
