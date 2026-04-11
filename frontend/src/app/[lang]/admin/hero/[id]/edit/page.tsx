"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { useDict } from "@/i18n/context";
import type { HeroSlide } from "@/types/hero-slide";
import { adminFetch } from "@/api/admin-api";

export default function EditHeroSlidePage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const dict = useDict();
  const d = dict.admin;
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/hero` : "/en/admin/hero";
  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/hero-slides/${id}`);
    if (!res.ok) {
      setError(d.heroSlides.notFound);
      setSlide(null);
      return;
    }
    setSlide((await res.json()) as HeroSlide);
  }, [id, d.heroSlides.notFound]);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !slide) {
    return (
      <div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => router.push(listHref)}
          className="text-sm underline"
        >
          {d.common.backToList}
        </button>
      </div>
    );
  }

  if (!slide) {
    return (
      <p className="text-black/50 text-sm animate-pulse">
        {d.heroSlides.loadingData}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {d.heroSlides.editTitle}{" "}
        {slide.translations.find((t) => t.locale === "en")?.headline || slide.id}
      </h1>
      <HeroSlideForm
        mode="edit"
        slideId={slide.id.toString()}
        initial={slide}
      />
    </div>
  );
}
