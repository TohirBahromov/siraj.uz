"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HERO_SLIDES } from "@/data/hero-slides";
import { useScrollY } from "@/hooks/useScrollY";
import { useDict } from "@/i18n/context";
import {
  DESKTOP_BREAKPOINT,
  MAX_BORDER_RADIUS,
  MAX_SIDE_PADDING,
  MAX_VERTICAL_PADDING,
  SHRINK_SCROLL_RANGE,
  SLIDE_INTERVAL_MS,
} from "@/constants/hero";
import SlideIndicators from "./SlideIndicators";
import SlideContent from "./SlideContent";
import PauseIcon from "@/components/icons/pause";
import PlayIcon from "@/components/icons/play";
import type { PublicHeroSlide } from "@/types/hero-slide";

export function Hero({ slides }: { slides: PublicHeroSlide[] }) {
  const scrollY = useScrollY();
  const dict = useDict();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Combine dynamic slides with fallback static slides
  const currentSlides: PublicHeroSlide[] =
    slides.length > 0
      ? slides
      : HERO_SLIDES.map((s, i) => ({
          ...s,
          eyebrow: dict.hero.slides[i]?.eyebrow ?? "",
          headline: dict.hero.slides[i]?.headline ?? "",
          subline: dict.hero.slides[i]?.subline ?? "",
        }));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current = Array(currentSlides.length).fill(null);
  }, [currentSlides.length]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentSlides.length);
    }, SLIDE_INTERVAL_MS);
  }, [currentSlides.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goToSlide = (i: number) => {
    setActiveSlide(i);
    resetTimer();
  };

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeSlide) {
        video.currentTime = 0;
        if (isPlaying) {
          video.play().catch(() => setIsPlaying(false));
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeSlide, isPlaying]);

  const togglePlayback = () => {
    const video = videoRefs.current[activeSlide];
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying((prev) => !prev);
  };

  const progress = isDesktop ? clamp(scrollY / SHRINK_SCROLL_RANGE, 0, 1) : 0;
  const sidePadding = lerp(0, MAX_SIDE_PADDING, progress);
  const verticalPadding = lerp(0, MAX_VERTICAL_PADDING, progress);
  const borderRadius = lerp(0, MAX_BORDER_RADIUS, progress);

  const slideConfig = currentSlides[activeSlide];

  if (!slideConfig) return null;

  return (
    <div
      style={{
        height: isDesktop ? `calc(100vh + ${SHRINK_SCROLL_RANGE}px)` : "100svh",
      }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          paddingLeft: `${sidePadding}px`,
          paddingRight: `${sidePadding}px`,
          paddingTop: `${verticalPadding}px`,
          paddingBottom: `${verticalPadding}px`,
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden bg-slate-900"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          {/* Video backgrounds */}
          {currentSlides.map((s, i) => (
            <video
              key={s.id}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={s.videoSrc}
              muted
              loop
              playsInline
              aria-hidden
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <SlideContent
              key={slideConfig.id}
              config={slideConfig}
            />
          </AnimatePresence>

          {/* Bottom bar: indicators + play/pause */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-10">
            <SlideIndicators
              count={currentSlides.length}
              active={activeSlide}
              onSelect={goToSlide}
            />
            <button
              onClick={togglePlayback}
              aria-label={
                isPlaying ? dict.hero.pauseVideo : dict.hero.playVideo
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition-colors"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          {/* Prev arrow */}
          <button
            onClick={() =>
              goToSlide(
                (activeSlide - 1 + currentSlides.length) % currentSlides.length,
              )
            }
            aria-label={dict.hero.prevSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={() => goToSlide((activeSlide + 1) % currentSlides.length)}
            aria-label={dict.hero.nextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
