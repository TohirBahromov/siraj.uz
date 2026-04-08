"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hasLocale } from "@/i18n/config";
import type { HeroSlide } from "@/types/hero-slide";
import { adminFetch } from "@/api/admin-api";

export default function AdminHeroSlidesPage() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang;
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
      setError(`Could not load hero slides (${res.status})`);
      setItems([]);
      return;
    }
    const data = (await res.json()) as HeroSlide[];
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm("Delete this hero slide?")) return;
    const res = await adminFetch(`/admin/hero-slides/${id}`, {
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
      <p className="text-black/50 text-sm animate-pulse">
        Loading hero slides…
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Hero Slides</h1>
        <Link
          href={`${base}/hero/new`}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-5 py-2.5 font-medium hover:bg-black/85"
        >
          New slide
        </Link>
      </div>
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/[0.03] text-black/50 font-medium border-b border-black/10">
            <tr>
              <th className="px-4 py-3">Headline (EN)</th>
              <th className="px-4 py-3">Video</th>
              <th className="px-4 py-3 w-40" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-black/40"
                >
                  No hero slides yet. Create one to see it on the home page.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-black/8 last:border-0 hover:bg-black/[0.02]"
                >
                  <td className="px-4 py-3 font-medium">
                    {s.translations.find((t) => t.locale === "en")?.headline ||
                      "Untitled"}
                  </td>
                  <td className="px-4 py-3 text-black/60 truncate max-w-[200px]">
                    {s.videoSrc}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`${base}/hero/${s.id}/edit`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
