import "server-only";
import type {
  PublicCategoryNode,
  PublicCategoryDetail,
} from "@/types/category";
import type { HomeProduct } from "@/types/product";

function getApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000/api"
  );
}

export async function fetchCategoryTree(
  locale: string,
): Promise<PublicCategoryNode[]> {
  const base = getApiBase();
  const url = `${base}/categories?locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load categories: ${res.status}`);
  }
  return res.json() as Promise<PublicCategoryNode[]>;
}

export async function fetchCategoryBySlug(
  slug: string,
  locale: string,
): Promise<PublicCategoryDetail> {
  const base = getApiBase();
  const url = `${base}/categories/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Category not found: ${res.status}`);
  }
  return res.json() as Promise<PublicCategoryDetail>;
}

export async function fetchCategoryProductsPage(
  slug: string,
  locale: string,
): Promise<{ products: HomeProduct[]; nextCursor: number | null }> {
  const base = getApiBase();
  const url = `${base}/categories/${encodeURIComponent(slug)}/products?locale=${encodeURIComponent(locale)}&limit=10`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { products: [], nextCursor: null };
  return res.json() as Promise<{ products: HomeProduct[]; nextCursor: number | null }>;
}

export async function fetchLeafCategoryTree(
  locale: string,
): Promise<PublicCategoryNode[]> {
  const base = getApiBase();
  const url = `${base}/categories?locale=${encodeURIComponent(locale)}&leafOnly=true`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json() as Promise<PublicCategoryNode[]>;
}
