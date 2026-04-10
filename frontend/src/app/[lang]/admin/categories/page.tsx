"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import type { AdminCategory } from "@/types/category";
import { Edit, Trash, ChevronRight } from "lucide-react";

function categoryLabel(cat: AdminCategory): string {
  return (
    cat.translations.find((t) => t.locale === "uz")?.name ??
    cat.translations.find((t) => t.locale === "en")?.name ??
    `#${cat.id}`
  );
}

function CategoryRow({
  cat,
  depth,
  base,
  lang,
  onRemove,
}: {
  cat: AdminCategory;
  depth: number;
  base: string;
  lang: string;
  onRemove: (id: number) => void;
}) {
  return (
    <>
      <tr className="border-b border-black/8 last:border-0 hover:bg-black/2">
        <td className="p-2 w-14">
          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-[#f5f5f7]">
            {cat.imgUrl && (
              <Image
                src={cat.imgUrl}
                alt={categoryLabel(cat)}
                fill
                className="object-cover"
              />
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {depth > 0 && (
              <span
                className="text-black/20 flex items-center"
                style={{ paddingLeft: `${depth * 12}px` }}
              >
                <ChevronRight size={14} />
              </span>
            )}
            <span className="font-medium text-sm">{categoryLabel(cat)}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-black/40 font-mono">
          {cat.slug}
        </td>
        <td className="px-4 py-3 text-sm text-black/40">
          {cat.parentId ? `#${cat.parentId}` : "—"}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`${base}/categories/${cat.id}/edit`}
              className="text-indigo-600 hover:underline p-2 bg-white rounded-sm"
            >
              <Edit size={16} />
            </Link>
            <button
              type="button"
              onClick={() => onRemove(cat.id)}
              className="text-red-600 hover:underline p-2 bg-white rounded-sm cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        </td>
      </tr>
      {cat.children?.map((child) => (
        <CategoryRow
          key={child.id}
          cat={child}
          depth={depth + 1}
          base={base}
          lang={lang}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}

export default function AdminCategoriesPage() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const dict = useDict();
  const d = dict.admin;
  const base = useMemo(
    () =>
      typeof lang === "string" && hasLocale(lang)
        ? `/${lang}/admin`
        : "/en/admin",
    [lang],
  );

  const [items, setItems] = useState<AdminCategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch("/admin/categories");
    if (!res.ok) {
      setError(`${d.categories.title} (${res.status})`);
      setItems([]);
      return;
    }
    setItems((await res.json()) as AdminCategory[]);
  }, [d.categories.title]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm(d.categories.deleteConfirm)) return;
    const res = await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert(d.common.deleteFailed);
      return;
    }
    load();
  }

  if (items === null) {
    return <p className="text-black/50 text-sm animate-pulse">{d.common.loading}</p>;
  }

  const topLevel = items.filter((c) => !c.parentId);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{d.categories.title}</h1>
        <Link
          href={`${base}/categories/new`}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-5 py-2.5 font-medium hover:bg-black/85"
        >
          {d.categories.newBtn}
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="rounded-md border border-black/10 bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/3 text-black/50 font-medium border-b border-black/10">
            <tr>
              <th className="px-4 py-3 w-14" />
              <th className="px-4 py-3">{d.categories.colName}</th>
              <th className="px-4 py-3">{d.categories.colSlug}</th>
              <th className="px-4 py-3">{d.categories.colParent}</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody>
            {topLevel.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-black/40">
                  {d.categories.empty}
                </td>
              </tr>
            ) : (
              topLevel.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  depth={0}
                  base={base}
                  lang={typeof lang === "string" ? lang : "en"}
                  onRemove={remove}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
