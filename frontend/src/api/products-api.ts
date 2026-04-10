import "server-only";
import type { HomeProduct, ContentBlock } from "@/types/product";
import type { PublicProductDetail } from "@/types/category";

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

export async function fetchProductBySlugId(
  slugId: string,
  locale: string,
): Promise<PublicProductDetail> {
  const base = getApiBase();
  const url = `${base}/products/${encodeURIComponent(slugId)}?locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Product not found: ${res.status}`);
  }
  return res.json() as Promise<PublicProductDetail>;
}

export async function fetchProductContent(
  slugId: string,
  locale: string,
): Promise<ContentBlock[]> {
  const base = getApiBase();
  const url = `${base}/products/${encodeURIComponent(slugId)}/content?locale=${encodeURIComponent(locale)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { blocks: ContentBlock[] };
  return data.blocks ?? [];
}
