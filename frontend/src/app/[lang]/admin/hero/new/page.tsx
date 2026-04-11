"use client";

import { useDict } from "@/i18n/context";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";

export default function NewHeroSlidePage() {
  const dict = useDict();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {dict.admin.heroSlides.newTitle}
      </h1>
      <HeroSlideForm mode="create" />
    </div>
  );
}
