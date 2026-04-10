"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { AdminCategory } from "@/types/category";

export default function EditCategoryPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/categories` : "/en/admin/categories";

  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/categories/${id}`);
    if (!res.ok) {
      setError("Category not found");
      return;
    }
    setCategory((await res.json()) as AdminCategory);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
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

  if (!category) {
    return <p className="text-black/50 text-sm animate-pulse">Loading…</p>;
  }

  const displayName =
    category.translations.find((t) => t.locale === "uz")?.name ??
    category.translations.find((t) => t.locale === "en")?.name ??
    `#${category.id}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Edit · {displayName}
      </h1>
      <CategoryForm mode="edit" categoryId={category.id} initial={category} />
    </div>
  );
}
