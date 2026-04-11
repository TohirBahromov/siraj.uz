"use client";

import { useState } from "react";
import { fetchCategoryProductsClient } from "@/api/categories-client";
import type { HomeProduct } from "@/types/product";
import ProductGridItem from "@/components/templates/ProductGridItem";

interface Props {
  initialProducts: HomeProduct[];
  initialNextCursor: number | null;
  categorySlug: string;
  lang: string;
  locale: string;
  noProductsText: string;
  loadMoreText: string;
}

export function CategoryProductList({
  initialProducts,
  initialNextCursor,
  categorySlug,
  lang,
  locale,
  noProductsText,
  loadMoreText,
}: Props) {
  const [products, setProducts] = useState<HomeProduct[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<number | null>(
    initialNextCursor,
  );
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor || loading) return;
    setLoading(true);
    const page = await fetchCategoryProductsClient(
      categorySlug,
      locale,
      nextCursor,
    );
    setProducts((prev) => [...prev, ...page.products]);
    setNextCursor(page.nextCursor);
    setLoading(false);
  }

  if (products.length === 0) {
    return (
      <p className="text-black/40 text-center py-20">
        {noProductsText}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product, index) => (
          <ProductGridItem key={product.id} config={product} index={index} />
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-full border border-black/15 text-sm font-medium text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:border-black/30 hover:bg-black/3 transition-all disabled:opacity-50"
          >
            {loading ? "…" : loadMoreText}
          </button>
        </div>
      )}
    </div>
  );
}
