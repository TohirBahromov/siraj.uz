"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminFetch } from "@/api/admin-api";
import { useDict } from "@/i18n/context";
import type { AdminProduct } from "@/types/product";

export default function EditProductPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const dict = useDict();
  const d = dict.admin;
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/products` : "/en/admin/products";
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/products/${id}`);
    if (!res.ok) {
      setError(d.products.notFound);
      setProduct(null);
      return;
    }
    setProduct((await res.json()) as AdminProduct);
  }, [id, d.products.notFound]);

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
          {d.common.backToList}
        </button>
      </div>
    );
  }

  if (!product) {
    return <p className="text-black/50 text-sm animate-pulse">{d.common.loading}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {d.common.editPrefix} {product.translations[0]?.title || product.id}
      </h1>
      <ProductForm mode="edit" productId={product.id} initial={product} />
    </div>
  );
}
