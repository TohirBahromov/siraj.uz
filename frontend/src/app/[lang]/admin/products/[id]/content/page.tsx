"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import { BlockEditor } from "@/components/admin/BlockEditor";
import type { ContentBlock } from "@/types/product";

const LOCALES = ["uz", "en", "ru"] as const;
type Locale = (typeof LOCALES)[number];

export default function ProductContentPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const dict = useDict();
  const d = dict.admin;
  const base = useMemo(
    () =>
      typeof lang === "string" && hasLocale(lang)
        ? `/${lang}/admin`
        : "/en/admin",
    [lang],
  );

  const [activeLocale, setActiveLocale] = useState<Locale>("uz");
  const [contentByLocale, setContentByLocale] = useState<
    Partial<Record<Locale, ContentBlock[]>>
  >({});
  const [loadedLocales, setLoadedLocales] = useState<Set<Locale>>(new Set());
  const [loading, setLoading] = useState(false);
  const [productTitle, setProductTitle] = useState<string>("");

  // Load product title for display
  useEffect(() => {
    if (!id) return;
    adminFetch(`/admin/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          const t =
            data.translations?.find((t: { locale: string }) => t.locale === lang) ??
            data.translations?.[0];
          setProductTitle(t?.title ?? `Product #${id}`);
        }
      });
  }, [id, lang]);

  const loadLocale = useCallback(
    async (locale: Locale) => {
      if (loadedLocales.has(locale) || !id) return;
      setLoading(true);
      const res = await adminFetch(`/admin/products/${id}/content/${locale}`);
      setLoading(false);
      if (res.ok) {
        const data = (await res.json()) as { blocks: ContentBlock[] };
        setContentByLocale((prev) => ({ ...prev, [locale]: data.blocks ?? [] }));
        setLoadedLocales((prev) => new Set(prev).add(locale));
      }
    },
    [id, loadedLocales],
  );

  // Load initial locale
  useEffect(() => {
    loadLocale("uz");
  }, [loadLocale]);

  function switchLocale(locale: Locale) {
    setActiveLocale(locale);
    loadLocale(locale);
  }

  const blocks = contentByLocale[activeLocale] ?? [];

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`${base}/products`}
          className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs text-black/40 mb-0.5">{d.products.contentLabel}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{productTitle}</h1>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/10 pb-0">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => switchLocale(locale)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors cursor-pointer border-b-2 -mb-px ${
              activeLocale === locale
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black"
            }`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editor */}
      {loading && !loadedLocales.has(activeLocale) ? (
        <p className="text-black/40 text-sm animate-pulse py-8">{d.common.loading}</p>
      ) : loadedLocales.has(activeLocale) ? (
        <BlockEditor
          key={`${id}-${activeLocale}`}
          productId={Number(id)}
          locale={activeLocale}
          initialBlocks={blocks}
        />
      ) : null}
    </div>
  );
}
