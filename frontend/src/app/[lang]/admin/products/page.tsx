"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import type { AdminProduct } from "@/types/product";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

export default function AdminProductsPage() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
  const base = useMemo(
    () =>
      typeof lang === "string" && hasLocale(lang)
        ? `/${lang}/admin`
        : "/en/admin",
    [lang],
  );

  const [items, setItems] = useState<AdminProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch("/admin/products");
    if (!res.ok) {
      setError(`Could not load products (${res.status})`);
      setItems([]);
      return;
    }
    const data = (await res.json()) as AdminProduct[];
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await adminFetch(`/admin/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    load();
  }

  if (items === null) {
    return (
      <p className="text-black/50 text-sm animate-pulse">Loading products…</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link
          href={`${base}/products/new`}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-5 py-2.5 font-medium hover:bg-black/85"
        >
          New product
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
              <th className="px-4 py-3">Rasm</th>
              <th className="px-4 py-3">Sarlavha</th>
              <th className="px-4 py-3">Qo'shimcha ma'lumot</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3 w-40" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-black/40"
                >
                  No products yet. Seed the database or create one.
                </td>
              </tr>
            ) : (
              items.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-black/8 last:border-0 hover:bg-black/2"
                >
                  {/* Img */}
                  <td className="p-2">
                    <div className="w-30 h-15 relative">
                      <Image
                        src={p.imgUrl}
                        alt={
                          p.translations.find((t) => t.locale === lang)
                            ?.title ||
                          p.translations[0]?.title ||
                          p.id
                        }
                        fill
                        className="object-contain"
                      />
                    </div>
                  </td>
                  {/* Title */}
                  <td className="px-4 py-3 font-medium">
                    {p.translations.find((t) => t.locale === lang)?.title ||
                      p.translations[0]?.title ||
                      p.id}
                  </td>
                  {/* Desc */}
                  <td>
                    {p.translations.find((t) => t.locale === lang)?.desc ||
                      p.translations[0]?.desc ||
                      p.id}
                  </td>
                  {/* Placement */}
                  <td className="px-4 py-3 text-black/60">{p.placement}</td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-2 h-full justify-end">
                    <div className="flex items-center justify-end gap-2 h-full">
                      <Link
                        href={`${base}/products/${p.id}/edit`}
                        className="text-indigo-600 hover:underline p-2 bg-white rounded-sm"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="text-red-600 hover:underline p-2 bg-white rounded-sm cursor-pointer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
