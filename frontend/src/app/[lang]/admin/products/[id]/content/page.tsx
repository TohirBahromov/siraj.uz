"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Info } from "lucide-react";
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
  const dp = dict.admin.products;
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
  const [copying, setCopying] = useState(false);
  const [productTitle, setProductTitle] = useState<string>("");
  // Increment to force BlockEditor remount after copy
  const [copyKeys, setCopyKeys] = useState<Partial<Record<Locale, number>>>({});

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

  async function switchLocale(locale: Locale) {
    setActiveLocale(locale);
    await loadLocale(locale);
  }

  async function copyFrom(sourceLocale: Locale) {
    if (copying) return;
    setCopying(true);
    // Ensure source is loaded first
    if (!loadedLocales.has(sourceLocale)) {
      setLoading(true);
      const res = await adminFetch(`/admin/products/${id}/content/${sourceLocale}`);
      setLoading(false);
      if (res.ok) {
        const data = (await res.json()) as { blocks: ContentBlock[] };
        const blocks = data.blocks ?? [];
        setContentByLocale((prev) => ({ ...prev, [sourceLocale]: blocks }));
        setLoadedLocales((prev) => new Set(prev).add(sourceLocale));
        // Copy to active locale
        setContentByLocale((prev) => ({ ...prev, [activeLocale]: [...blocks] }));
      }
    } else {
      const sourceBlocks = contentByLocale[sourceLocale] ?? [];
      setContentByLocale((prev) => ({ ...prev, [activeLocale]: [...sourceBlocks] }));
    }
    setLoadedLocales((prev) => new Set(prev).add(activeLocale));
    // Force BlockEditor remount
    setCopyKeys((prev) => ({ ...prev, [activeLocale]: (prev[activeLocale] ?? 0) + 1 }));
    setCopying(false);
  }

  const blocks = contentByLocale[activeLocale] ?? [];
  const hasContent = (locale: Locale) =>
    loadedLocales.has(locale) && (contentByLocale[locale]?.length ?? 0) > 0;

  const editorDict = {
    saving: dp.editorSaving,
    saveBtn: dp.editorSaveBtn,
    saved: dp.editorSaved,
    loading: dp.editorLoading,
    saveFailed: dp.editorSaveFailed,
  };

  return (
    <div>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`${base}/products`}
          className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs text-black/40 mb-0.5">{dp.contentLabel}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{productTitle}</h1>
        </div>
      </div>

      {/* Tip banner */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/70 rounded-2xl px-4 py-3 mb-6 text-sm text-amber-800">
        <Info size={15} className="mt-0.5 shrink-0 text-amber-500" />
        <p>{dp.contentTip}</p>
      </div>

      {/* Locale tabs + Copy from */}
      <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-0 mb-0">
        <div className="flex gap-0">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchLocale(locale)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors cursor-pointer border-b-2 -mb-px ${
                activeLocale === locale
                  ? "border-black text-black"
                  : "border-transparent text-black/40 hover:text-black"
              }`}
            >
              {locale.toUpperCase()}
              {hasContent(locale) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {/* Copy from buttons */}
        <div className="flex items-center gap-2 pb-2 shrink-0">
          <span className="text-xs text-black/40 font-medium">{dp.contentCopyFrom}</span>
          {LOCALES.filter((l) => l !== activeLocale).map((sourceLocale) => (
            <button
              key={sourceLocale}
              type="button"
              disabled={copying || loading}
              onClick={() => copyFrom(sourceLocale)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-black/15 text-black/60 hover:text-black hover:border-black/30 hover:bg-black/3 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Copy size={11} />
              {sourceLocale.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="pt-6">
        {loading && !loadedLocales.has(activeLocale) ? (
          <p className="text-black/40 text-sm animate-pulse py-8">{dict.admin.common.loading}</p>
        ) : loadedLocales.has(activeLocale) ? (
          <BlockEditor
            key={`${id}-${activeLocale}-${copyKeys[activeLocale] ?? 0}`}
            productId={Number(id)}
            locale={activeLocale}
            initialBlocks={blocks}
            dict={editorDict}
          />
        ) : null}
      </div>
    </div>
  );
}
