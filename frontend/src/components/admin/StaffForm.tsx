"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/i18n/context";
import { Upload } from "lucide-react";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "uz", label: "O'zbek" },
  { id: "ru", label: "Русский" },
] as const;

type Locale = (typeof LOCALES)[number]["id"];

type TrFields = { name: string; position: string };

function emptyTranslations(): Record<Locale, TrFields> {
  return {
    en: { name: "", position: "" },
    uz: { name: "", position: "" },
    ru: { name: "", position: "" },
  };
}

export interface AdminStaffMember {
  id: number;
  imageUrl: string;
  order: number;
  translations: { locale: string; name: string; position: string }[];
}

function fromAdminStaff(
  s: AdminStaffMember,
): { imageUrl: string; order: number; translations: Record<Locale, TrFields> } {
  const translations = emptyTranslations();
  for (const t of s.translations) {
    if (t.locale === "en" || t.locale === "uz" || t.locale === "ru") {
      translations[t.locale] = { name: t.name, position: t.position };
    }
  }
  return { imageUrl: s.imageUrl, order: s.order, translations };
}

export function StaffForm({
  mode,
  staffId,
  initial,
}: {
  mode: "create" | "edit";
  staffId?: number;
  initial?: AdminStaffMember | null;
}) {
  const router = useRouter();
  const params = useParams<{ lang: string }>();
  const dict = useDict();
  const d = dict.admin;

  const adminListPath = useMemo(() => {
    const lang = params.lang;
    return typeof lang === "string" && hasLocale(lang)
      ? `/${lang}/admin/staff`
      : "/en/admin/staff";
  }, [params.lang]);

  const initialState = useMemo(() => {
    if (initial) return fromAdminStaff(initial);
    return { imageUrl: "", order: 0, translations: emptyTranslations() };
  }, [initial]);

  const [activeTab, setActiveTab] = useState<Locale>("en");
  const [imageUrl, setImageUrl] = useState(initialState.imageUrl);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [order, setOrder] = useState(initialState.order);
  const [translations, setTranslations] = useState(initialState.translations);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function setTr(locale: Locale, field: keyof TrFields, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    setLocalPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/admin/upload?folder=staff", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError(d.staff.form.uploadFirst);
      return;
    }

    setLoading(true);
    const payload = {
      imageUrl,
      order,
      translations: LOCALES.map(({ id }) => ({
        locale: id,
        name: translations[id].name,
        position: translations[id].position,
      })),
    };

    try {
      const path =
        mode === "create"
          ? "/admin/staff-members"
          : `/admin/staff-members/${staffId}`;
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

  const previewSrc = localPreview || imageUrl || null;

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
            <span className="text-black/60">{d.staff.form.nameLabel}</span>
            <input
              required
              value={translations[activeTab].name}
              onChange={(e) => setTr(activeTab, "name", e.target.value)}
              placeholder={d.staff.form.namePlaceholder}
              className="rounded-xl border border-black/15 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">{d.staff.form.positionLabel}</span>
            <input
              required
              value={translations[activeTab].position}
              onChange={(e) => setTr(activeTab, "position", e.target.value)}
              placeholder={d.staff.form.positionPlaceholder}
              className="rounded-xl border border-black/15 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </label>
        </div>
      </div>

      {/* ── Photo upload ── */}
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
        <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold">
          {d.staff.form.photoTitle}
        </div>
        <div className="p-6 flex items-start gap-6">
          {/* Preview */}
          <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/10 shrink-0">
            {previewSrc ? (
              <Image
                src={previewSrc}
                alt="Preview"
                fill
                className="object-cover object-top"
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
              {uploading ? d.common.uploading : d.staff.form.choosePhoto}
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
            {imageUrl && !uploading && (
              <p className="text-xs text-black/40 break-all max-w-xs">
                {imageUrl}
              </p>
            )}
            <p className="text-xs text-black/30">
              {d.staff.form.photoHint}
            </p>
          </div>
        </div>
      </div>

      {/* ── Display order ── */}
      <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
        <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold">
          {d.staff.form.displayOrderTitle}
        </div>
        <div className="p-6">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/60">
              {d.staff.form.orderHint}
            </span>
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="rounded-xl border border-black/15 px-3 py-2 bg-white w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
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
              ? d.staff.form.createBtn
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
