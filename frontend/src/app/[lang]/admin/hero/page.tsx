"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import type { HeroSlide } from "@/types/hero-slide";
import { adminFetch } from "@/api/admin-api";
import { Edit, Trash } from "lucide-react";

export default function AdminHeroSlidesPage() {
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

  const [items, setItems] = useState<HeroSlide[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await adminFetch("/admin/hero-slides");
    if (!res.ok) {
      setError(`${d.heroSlides.title} (${res.status})`);
      setItems([]);
      return;
    }
    setItems((await res.json()) as HeroSlide[]);
  }, [d.heroSlides.title]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm(d.heroSlides.deleteConfirm)) return;
    const res = await adminFetch(`/admin/hero-slides/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert(d.common.deleteFailed);
      return;
    }
    load();
  }

  if (items === null) {
    return <p className="text-black/50 text-sm animate-pulse">{d.common.loading}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{d.heroSlides.title}</h1>
        <Link
          href={`${base}/hero/new`}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-5 py-2.5 font-medium hover:bg-black/85"
        >
          {d.heroSlides.newBtn}
        </Link>
      </div>
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm text-left">
          <thead className="bg-black/3 text-black/50 font-medium border-b border-black/10">
            <tr>
              <th className="px-4 py-3">{d.heroSlides.colHeadline}</th>
              <th className="px-4 py-3">{d.heroSlides.colVideo}</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-black/40">
                  {d.heroSlides.empty}
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-black/8 last:border-0 hover:bg-black/2"
                >
                  <td className="px-4 py-3 font-medium">
                    {s.translations.find((t) => t.locale === "en")?.headline || "—"}
                  </td>
                  <td className="px-4 py-3 text-black/60 truncate max-w-50">
                    {s.videoSrc}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${base}/hero/${s.id}/edit`}
                        className="text-indigo-600 p-2 bg-white rounded-sm hover:underline"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(s.id)}
                        className="text-red-600 p-2 bg-white rounded-sm hover:underline cursor-pointer"
                      >
                        <Trash size={16} />
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
    </div>
  );
}
