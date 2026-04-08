"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useRef } from "react";
import { adminFetch } from "@/api/admin-api";
import { hasLocale } from "@/i18n/config";
import type { AdminProduct, HomeProduct } from "@/types/product";
import ProductGridItemAdmin from "../templates/ProductGridItemAdmin";
import ProductShowcaseItemAdmin from "../templates/ProductShowcaseItemAdmin";

const LOCALES = [
  { id: "en", label: "English" },
  { id: "uz", label: "O'zbek" },
  { id: "ru", label: "Русский" },
] as const;

type TrFields = { title: string; desc: string };

function emptyTranslations(): Record<string, TrFields> {
  const base = { title: "", desc: "" };
  return { en: { ...base }, uz: { ...base }, ru: { ...base } };
}

function fromAdminProduct(p: AdminProduct): {
  placement: "SHOWCASE" | "GRID";
  badgeColor: string;
  titleColor: string;
  descColor: string;
  btn1Color: string;
  btn1BgColor: string;
  btn2Color: string;
  btn2BgColor: string;
  imgUrl: string;
  backgroundColor: string;
  badge: string;
  translations: Record<string, TrFields>;
} {
  const translations = emptyTranslations();
  let badge = "";
  for (const t of p.translations) {
    translations[t.locale] = { title: t.title, desc: t.desc };
    if (t.locale === "en" && t.badge) badge = t.badge;
  }
  return {
    placement: p.placement,
    badgeColor: p.badgeColor,
    titleColor: p.titleColor,
    descColor: p.descColor,
    btn1Color: p.btn1Color,
    btn1BgColor: p.btn1BgColor,
    btn2Color: p.btn2Color,
    btn2BgColor: p.btn2BgColor,
    imgUrl: p.imgUrl,
    backgroundColor: p.backgroundColor,
    badge,
    translations,
  };
}

export function ProductForm({
  mode,
  productId,
  initial,
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: AdminProduct | null;
}) {
  const router = useRouter();
  const params = useParams<{ lang: string }>();

  const adminListPath = useMemo(() => {
    const lang = params.lang;
    if (typeof lang === "string" && hasLocale(lang))
      return `/${lang}/admin/products`;
    return "/en/admin/products";
  }, [params.lang]);

  const initialState = useMemo(() => {
    if (initial) return fromAdminProduct(initial);
    return {
      placement: "GRID" as const,
      badgeColor: "#000000",
      titleColor: "#000000",
      descColor: "#000000",
      btn1Color: "#ffffff",
      btn1BgColor: "#000000",
      btn2Color: "#000000",
      btn2BgColor: "#ffffff",
      imgUrl: "",
      backgroundColor: "#ffffff",
      badge: "",
      translations: emptyTranslations(),
    };
  }, [initial]);

  const [activeTab, setActiveTab] = useState<"en" | "uz" | "ru">("en");
  const [placement, setPlacement] = useState<"SHOWCASE" | "GRID">(
    initialState.placement,
  );

  // colors — all edited via pipette in preview
  const [badgeColor, setBadgeColor] = useState(initialState.badgeColor);
  const [titleColor, setTitleColor] = useState(initialState.titleColor);
  const [descColor, setDescColor] = useState(initialState.descColor);
  const [btn1Color, setBtn1Color] = useState(initialState.btn1Color);
  const [btn1BgColor, setBtn1BgColor] = useState(initialState.btn1BgColor);
  const [btn2Color, setBtn2Color] = useState(initialState.btn2Color);
  const [btn2BgColor, setBtn2BgColor] = useState(initialState.btn2BgColor);
  const [backgroundColor, setBackgroundColor] = useState(
    initialState.backgroundColor,
  );

  const [imgUrl, setImgUrl] = useState(initialState.imgUrl);
  const [localPreviewObj, setLocalPreviewObj] = useState<string | null>(null);
  const [translations, setTranslations] = useState(initialState.translations);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function setTr(locale: string, field: keyof TrFields, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  }

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewObj(objectUrl);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImgUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      placement,
      badgeColor,
      titleColor,
      descColor,
      btn1Color,
      btn1BgColor,
      btn2Color,
      btn2BgColor,
      imgUrl,
      backgroundColor,
      translations: LOCALES.map(({ id }) => ({
        locale: id,
        title: translations[id].title,
        desc: translations[id].desc,
      })),
    };
    try {
      const path =
        mode === "create" ? "/admin/products" : `/admin/products/${productId}`;
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

  const pData = translations[activeTab];
  const activeImgUrl =
    localPreviewObj || imgUrl || "https://placehold.co/600x400/png";

  const previewData: HomeProduct = {
    id: "preview",
    badge: null, // badge managed via separate field if needed
    badgeColor,
    title: pData.title || "Preview Title",
    titleColor,
    desc: pData.desc || "Preview Description",
    descColor,
    btn1Color,
    btn1BgColor,
    btn2Color,
    btn2BgColor,
    imgUrl: activeImgUrl,
    backgroundColor,
    placement,
  };

  const sharedColorProps = {
    titleColor,
    setTitleColor,
    descColor,
    setDescColor,
    badgeColor,
    setBadgeColor,
    btn1Color,
    setBtn1Color,
    btn1BgColor,
    setBtn1BgColor,
    btn2Color,
    setBtn2Color,
    btn2BgColor,
    setBtn2BgColor,
    backgroundColor,
    setBackgroundColor,
    uploading,
    onUpload: uploadFile,
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        {/* LOCALE TABS + TEXT INPUTS */}
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
              <span className="text-black/60">Title</span>
              <input
                required
                value={translations[activeTab].title}
                onChange={(e) => setTr(activeTab, "title", e.target.value)}
                className="rounded-xl border border-black/15 px-3 py-2 bg-white"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-black/60">Description</span>
              <textarea
                required
                rows={3}
                value={translations[activeTab].desc}
                onChange={(e) => setTr(activeTab, "desc", e.target.value)}
                className="rounded-xl border border-black/15 px-3 py-2 resize-y min-h-[80px]"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* LIVE PREVIEW — all color + image editing happens here */}
        <div className="rounded-3xl border border-black/10 overflow-hidden bg-white shadow-sm">
          <div className="bg-[#f5f5f7] px-6 py-4 border-b border-black/10 text-sm font-semibold flex items-center justify-between">
            <span>
              Live Preview{" "}
              <span className="text-black/40 font-normal">
                — hover to change image · click pipette icons to change colors
              </span>
            </span>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as any)}
              className="rounded-xl border border-black/15 px-4 py-2 bg-white text-sm"
            >
              <option value="SHOWCASE">Showcase</option>
              <option value="GRID">Grid</option>
            </select>
          </div>

          <div className="max-w-full overflow-hidden">
            {placement === "GRID" ? (
              <div className="w-full md:w-145 mx-auto py-8">
                <ProductGridItemAdmin
                  config={previewData}
                  index={0}
                  {...sharedColorProps}
                />
              </div>
            ) : (
              <div className="w-full">
                <ProductShowcaseItemAdmin
                  config={previewData}
                  reversed={false}
                  {...sharedColorProps}
                />
              </div>
            )}
          </div>
        </div>

        {!imgUrl && !uploading && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            ⚠ No image uploaded yet — hover the preview and click the upload
            icon to add one.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#1d1d1f] text-white px-8 py-3 font-medium hover:bg-black/85 disabled:opacity-50"
          >
            {loading
              ? "Saving…"
              : mode === "create"
                ? "Create"
                : "Save changes"}
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
