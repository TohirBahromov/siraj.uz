"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import { slugify } from "@/lib/slugify";
import type { AdminCategory } from "@/types/category";
import { Upload } from "lucide-react";
import { Combobox } from "@/components/ui/Combobox";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "uz", label: "O'zbek" },
  { id: "ru", label: "Русский" },
] as const;

type LocaleId = (typeof LOCALES)[number]["id"];

type TrFields = { name: string; slug: string };

function emptyTranslations(): Record<LocaleId, TrFields> {
  return {
    en: { name: "", slug: "" },
    uz: { name: "", slug: "" },
    ru: { name: "", slug: "" },
  };
}

function fromAdminCategory(c: AdminCategory): {
  imgUrl: string;
  parentId: number | null;
  translations: Record<LocaleId, TrFields>;
} {
  const translations = emptyTranslations();
  for (const t of c.translations) {
    if (t.locale === "en" || t.locale === "uz" || t.locale === "ru") {
      translations[t.locale] = { name: t.name, slug: t.slug };
    }
  }
  return { imgUrl: c.imgUrl, parentId: c.parentId, translations };
}

export interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: number;
  initial?: AdminCategory | null;
}

export function CategoryForm({ mode, categoryId, initial }: CategoryFormProps) {
  const router = useRouter();
  const params = useParams<{ lang: string }>();
  const dict = useDict();
  const d = dict.admin;

  const adminListPath = useMemo(() => {
    const lang = params.lang;
    return typeof lang === "string" && hasLocale(lang)
      ? `/${lang}/admin/categories`
      : "/en/admin/categories";
  }, [params.lang]);

  const initialState = useMemo(() => {
    if (initial) return fromAdminCategory(initial);
    return { imgUrl: "", parentId: null, translations: emptyTranslations() };
  }, [initial]);

  const [activeTab, setActiveTab] = useState<LocaleId>("uz");
  const [imgUrl, setImgUrl] = useState(initialState.imgUrl);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [parentId, setParentId] = useState<number | null>(initialState.parentId);
  const [translations, setTranslations] = useState(initialState.translations);
  const [allCategories, setAllCategories] = useState<AdminCategory[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load all categories for the parent selector
  useEffect(() => {
    adminFetch("/admin/categories")
      .then((r) => r.json())
      .then((data: AdminCategory[]) => {
        // Exclude current category and its children from parent options
        const filtered = mode === "edit" && categoryId
          ? data.filter((c) => c.id !== categoryId)
          : data;
        setAllCategories(filtered);
      })
      .catch(() => {});
  }, [mode, categoryId]);

  function setTr(locale: LocaleId, field: keyof TrFields, value: string) {
    setTranslations((prev) => {
      const updated = { ...prev, [locale]: { ...prev[locale], [field]: value } };
      // Auto-generate slug when name changes
      if (field === "name") {
        updated[locale].slug = slugify(value);
      }
      return updated;
    });
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    setLocalPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/admin/upload?folder=categories", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImgUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imgUrl) {
      setError(d.categories.form.uploadFirst);
      return;
    }

    setLoading(true);
    const payload = {
      imgUrl,
      parentId: parentId ?? null,
      translations: LOCALES.map(({ id }) => ({
        locale: id,
        name: translations[id].name,
      })),
    };

    try {
      const path =
        mode === "create"
          ? "/admin/categories"
          : `/admin/categories/${categoryId}`;
      const res = await adminFetch(path, {
        method: mode === "create" ? "POST" : "PATCH",
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        message?: string | string[];
      } | null;
      if (!res.ok) {
        const msg = data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
              ? msg.join(", ")
              : `Save failed (${res.status})`,
        );
        return;
      }
      router.push(adminListPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const previewSrc = localPreview || imgUrl || null;

  // Build flat display name for parent categories (prefers uz then en)
  function categoryLabel(cat: AdminCategory): string {
    return (
      cat.translations.find((t) => t.locale === "uz")?.name ??
      cat.translations.find((t) => t.locale === "en")?.name ??
      `Category #${cat.id}`
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-2xl">
      {/* ── Locale tabs ── */}
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
        <div className="flex border-b border-black/10 bg-[#f5f5f7]">
          {LOCALES.map((locale) => (
            <button
              key={locale.id}
              type="button"
              onClick={() => setActiveTab(locale.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === locale.id
                  ? "border-black text-black bg-white"
                  : "border-transparent text-black/50 hover:bg-black/5 hover:text-black/80"
              }`}
            >
              {locale.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">{d.categories.form.nameLabel}</span>
            <input
              required
              value={translations[activeTab].name}
              onChange={(e) => setTr(activeTab, "name", e.target.value)}
              placeholder={d.categories.form.namePlaceholder}
              className="rounded-xl border border-black/15 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              {d.categories.form.slugLabel}
            </span>
            <input
              value={translations[activeTab].slug}
              onChange={(e) => setTr(activeTab, "slug", e.target.value)}
              placeholder={d.categories.form.slugPlaceholder}
              className="rounded-xl border border-black/15 px-3 py-2 bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-black/50"
            />
          </label>
        </div>
      </div>

      {/* ── Thumbnail upload ── */}
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
        <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold">
          {d.categories.form.thumbnailTitle}
        </div>
        <div className="p-6 flex items-start gap-6">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/10 shrink-0">
            {previewSrc ? (
              <Image
                src={previewSrc}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-black/20">
                <Upload size={28} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium hover:bg-black/5 transition-colors">
              <Upload size={16} />
              {uploading ? d.common.uploading : d.categories.form.chooseImage}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                }}
              />
            </label>
            {imgUrl && !uploading && (
              <p className="text-xs text-black/40 break-all max-w-xs">{imgUrl}</p>
            )}
            <p className="text-xs text-black/30">
              {d.categories.form.imageHint}
            </p>
          </div>
        </div>
      </div>

      {/* ── Parent category ── */}
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
        <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold">
          {d.categories.form.parentTitle}
        </div>
        <div className="p-6">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              {d.categories.form.parentHint}
            </span>
            <Combobox
              options={allCategories.map((cat) => ({
                value: String(cat.id),
                label: categoryLabel(cat),
              }))}
              value={parentId !== null && parentId !== undefined ? String(parentId) : ""}
              onChange={(v) => setParentId(v ? Number(v) : null)}
              nullable
              nullLabel={d.categories.form.noParent}
              placeholder={d.categories.form.noParent}
            />
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-full bg-[#1d1d1f] text-white px-8 py-3 font-medium hover:bg-black/85 disabled:opacity-50 transition-colors"
        >
          {loading
            ? d.common.saving
            : mode === "create"
              ? d.categories.form.createBtn
              : d.common.saveChanges}
        </button>
        <button
          type="button"
          onClick={() => router.push(adminListPath)}
          className="rounded-full border border-black/15 px-8 py-3 font-medium hover:bg-black/5 transition-colors"
        >
          {d.common.cancel}
        </button>
      </div>
    </form>
  );
}
