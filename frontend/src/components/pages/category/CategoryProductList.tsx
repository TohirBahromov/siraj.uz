"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategoryProductsClient } from "@/api/categories-client";
import type { HomeProduct } from "@/types/product";

interface Props {
  initialProducts: HomeProduct[];
  initialNextCursor: number | null;
  categorySlug: string;
  lang: string;
  locale: string;
}

export function CategoryProductList({
  initialProducts,
  initialNextCursor,
  categorySlug,
  lang,
  locale,
}: Props) {
  const [products, setProducts] = useState<HomeProduct[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<number | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor || loading) return;
    setLoading(true);
    const page = await fetchCategoryProductsClient(categorySlug, locale, nextCursor);
    setProducts((prev) => [...prev, ...page.products]);
    setNextCursor(page.nextCursor);
    setLoading(false);
  }

  if (products.length === 0) {
    return (
      <p className="text-black/40 text-center py-20">
        No products in this category yet.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${lang}/categories/${categorySlug}/${product.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden border border-black/8 hover:border-black/20 hover:shadow-lg transition-all duration-300"
            style={{ backgroundColor: product.backgroundColor }}
          >
            {/* Aspect-ratio image container */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.imgUrl}
                alt={product.title}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-black/6">
              {product.badge && (
                <span
                  className="text-xs font-medium mb-1 block"
                  style={{ color: product.badgeColor }}
                >
                  {product.badge}
                </span>
              )}
              <h3
                className="font-semibold text-sm group-hover:opacity-80 transition-opacity leading-snug"
                style={{ color: product.titleColor }}
              >
                {product.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-full border border-black/15 text-sm font-medium text-[#1d1d1f]/70 hover:text-[#1d1d1f] hover:border-black/30 hover:bg-black/3 transition-all disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
