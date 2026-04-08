"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminFetch } from "@/api/admin-api";
import type { AdminProduct } from "@/types/product";

export default function EditProductPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/products` : "/en/admin/products";
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/products/${id}`);
    if (!res.ok) {
      setError("Product not found");
      setProduct(null);
      return;
    }
    setProduct((await res.json()) as AdminProduct);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !product) {
    return (
      <div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => router.push(listHref)}
          className="text-sm underline"
        >
          Back to list
        </button>
      </div>
    );
  }

  if (!product) {
    return <p className="text-black/50 text-sm animate-pulse">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Edit · {product.translations[0]?.title || product.id}
      </h1>
      <ProductForm mode="edit" productId={product.id} initial={product} />
    </div>
  );
}
