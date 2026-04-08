"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import type { HeroSlide } from "@/types/hero-slide";
import { adminFetch } from "@/api/admin-api";

export default function EditHeroSlidePage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const listHref =
    typeof lang === "string" ? `/${lang}/admin/hero` : "/en/admin/hero";
  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    const res = await adminFetch(`/admin/hero-slides/${id}`);
    if (!res.ok) {
      setError("Hero slide not found");
      setSlide(null);
      return;
    }
    setSlide((await res.json()) as HeroSlide);
  }, [id]);

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
          Back to list
        </button>
      </div>
    );
  }

  if (!slide) {
    return (
      <p className="text-black/50 text-sm animate-pulse">
        Loading hero slide data…
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Edit Slide ·{" "}
        {slide.translations.find((t) => t.locale === "en")?.headline ||
          slide.id}
      </h1>
      <HeroSlideForm
        mode="edit"
        slideId={slide.id.toString()}
        initial={slide}
      />
    </div>
  );
}
