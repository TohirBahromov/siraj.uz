"use client";

import { HeroSlideForm } from "@/components/admin/HeroSlideForm";

export default function NewHeroSlidePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        New Hero Slide
      </h1>
      <HeroSlideForm mode="create" />
    </div>
  );
}
