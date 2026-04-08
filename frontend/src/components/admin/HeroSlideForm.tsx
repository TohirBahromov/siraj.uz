"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import type { HeroSlide, PublicHeroSlide } from "@/types/hero-slide";
import HeroSlidePreviewAdmin from "../templates/HeroSlidePreviewAdmin";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "uz", label: "O'zbek" },
  { id: "ru", label: "Русский" },
] as const;

type TrFields = {
  eyebrow: string;
  headline: string;
  subline: string;
};

function emptyTranslations(): Record<string, TrFields> {
  const base = { eyebrow: "", headline: "", subline: "" };
  return { en: { ...base }, uz: { ...base }, ru: { ...base } };
}

function fromHeroSlide(s: HeroSlide) {
  const translations = emptyTranslations();
  for (const t of s.translations) {
    translations[t.locale] = {
      eyebrow: t.eyebrow,
      headline: t.headline,
      subline: t.subline,
    };
  }
  return { ...s, translations };
}

export function HeroSlideForm({
  mode,
  slideId,
  initial,
}: {
  mode: "create" | "edit";
  slideId?: string;
  initial?: HeroSlide | null;
}) {
  const router = useRouter();
  const params = useParams<{ lang: string }>();

  const adminListPath = useMemo(() => {
    const lang = params.lang;
    return hasLocale(lang) ? `/${lang}/admin/hero` : "/en/admin/hero";
  }, [params.lang]);

  const initialState = useMemo(
    () =>
      initial
        ? fromHeroSlide(initial)
        : {
            videoSrc: "",
            eyebrowColor: "#e9d5ff",
            headlineColor: "#ffffff",
            sublineColor: "#ffffff99",
            translations: emptyTranslations(),
          },
    [initial],
  );

  const [activeTab, setActiveTab] = useState<"en" | "uz" | "ru">("en");
  const [videoSrc, setVideoSrc] = useState(initialState.videoSrc);
  const [eyebrowColor, setEyebrowColor] = useState(initialState.eyebrowColor);
  const [headlineColor, setHeadlineColor] = useState(initialState.headlineColor);
  const [sublineColor, setSublineColor] = useState(initialState.sublineColor);
  const [translations, setTranslations] = useState(initialState.translations);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setTr(locale: string, field: keyof TrFields, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  }

  const onUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setVideoSrc(data.url);
    } catch {
      setError("Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      videoSrc,
      eyebrowColor,
      headlineColor,
      sublineColor,
      translations: LOCALES.map(({ id }) => ({
        locale: id,
        ...translations[id],
      })),
    };
    try {
      const path =
        mode === "create"
          ? "/admin/hero-slides"
          : `/admin/hero-slides/${slideId}`;
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

  const previewConfig: PublicHeroSlide = {
    id: 0,
    videoSrc,
    eyebrowColor,
    headlineColor,
    sublineColor,
    ...translations[activeTab],
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        {/* LOCALE TABS + TEXT INPUTS */}
        <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
          <div className="flex border-b border-black/10 bg-[#f5f5f7]">
            {LOCALES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setActiveTab(l.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === l.id
                    ? "border-black text-black bg-white"
                    : "border-transparent text-black/50 hover:bg-black/5 hover:text-black/80"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-black/60">Eyebrow</span>
              <input
                required
                value={translations[activeTab].eyebrow}
                onChange={(e) => setTr(activeTab, "eyebrow", e.target.value)}
                className="rounded-xl border border-black/15 px-3 py-2 bg-white"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-black/60">Headline</span>
              <textarea
                required
                rows={2}
                value={translations[activeTab].headline}
                onChange={(e) => setTr(activeTab, "headline", e.target.value)}
                className="rounded-xl border border-black/15 px-3 py-2 resize-y min-h-15 text-lg font-bold"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-black/60">Subline</span>
              <textarea
                required
                rows={2}
                value={translations[activeTab].subline}
                onChange={(e) => setTr(activeTab, "subline", e.target.value)}
                className="rounded-xl border border-black/15 px-3 py-2 resize-y min-h-15"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* LIVE PREVIEW — video upload + color pipettes */}
        <div className="rounded-3xl border border-black/10 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold">
            Live Preview{" "}
            <span className="text-black/40 font-normal">
              — click "Change Video" to upload · click pipette icons to change
              text colors
            </span>
          </div>
          <HeroSlidePreviewAdmin
            config={previewConfig}
            eyebrowColor={eyebrowColor}
            setEyebrowColor={setEyebrowColor}
            headlineColor={headlineColor}
            setHeadlineColor={setHeadlineColor}
            sublineColor={sublineColor}
            setSublineColor={setSublineColor}
            uploading={uploading}
            onUpload={onUpload}
          />
        </div>

        {!videoSrc && !uploading && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            ⚠ No video uploaded yet — click "Change Video" in the preview to add one.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#1d1d1f] text-white px-8 py-3 font-medium hover:bg-black/85 disabled:opacity-50"
          >
            {loading ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(adminListPath)}
            className="rounded-full border border-black/15 px-8 py-3 font-medium hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
