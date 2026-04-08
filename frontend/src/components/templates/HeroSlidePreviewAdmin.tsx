"use client";

import { useEffect, useRef } from "react";
import { Pipette, Video } from "lucide-react";
import type { PublicHeroSlide } from "@/types/hero-slide";

function Pipetter({
  id,
  color,
  setColor,
  label,
}: {
  id: string;
  color: string;
  setColor: (c: string) => void;
  label: string;
}) {
  return (
    <label
      htmlFor={id}
      title={label}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm shadow cursor-pointer hover:bg-white/40 transition-colors shrink-0"
      style={{ border: `2px solid ${color}` }}
    >
      <Pipette size={11} className="text-white" />
      <input
        type="color"
        id={id}
        className="sr-only"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </label>
  );
}

interface Props {
  config: PublicHeroSlide;
  eyebrowColor: string;
  setEyebrowColor: (c: string) => void;
  headlineColor: string;
  setHeadlineColor: (c: string) => void;
  sublineColor: string;
  setSublineColor: (c: string) => void;
  uploading: boolean;
  onUpload: (file: File) => void;
}

export default function HeroSlidePreviewAdmin({
  config,
  eyebrowColor,
  setEyebrowColor,
  headlineColor,
  setHeadlineColor,
  sublineColor,
  setSublineColor,
  uploading,
  onUpload,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay as soon as a new src is set
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !config.videoSrc) return;
    video.load();
    video.play().catch(() => {});
  }, [config.videoSrc]);

  return (
    <section className="relative w-full h-200 bg-slate-900 overflow-hidden">
      {/* Video Background */}
      {config.videoSrc ? (
        <video
          ref={videoRef}
          src={config.videoSrc}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
          No Video Selected
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Upload progress overlay */}
      {uploading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm">
          <svg
            className="w-10 h-10 text-white animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-white text-sm font-medium">
            Uploading video…
          </span>
          {/* Indeterminate progress bar */}
          <div className="w-48 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-white animate-[slide_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs hover:bg-black/70 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Video size={14} />
        {uploading ? "Uploading..." : "Change Video"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />

      {/* Slide Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: eyebrowColor }}
          >
            {config.eyebrow || "Eyebrow Preview"}
          </span>
          <Pipetter
            id="hero-eyebrow-color"
            color={eyebrowColor}
            setColor={setEyebrowColor}
            label="Eyebrow color"
          />
        </div>

        {/* Headline */}
        <div className="flex items-center gap-2">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight whitespace-pre-line"
            style={{ color: headlineColor }}
          >
            {config.headline || "Headline Preview"}
          </h1>
          <Pipetter
            id="hero-headline-color"
            color={headlineColor}
            setColor={setHeadlineColor}
            label="Headline color"
          />
        </div>

        {/* Subline */}
        <div className="flex items-center gap-2 mt-4">
          <p className="max-w-md text-sm" style={{ color: sublineColor }}>
            {config.subline || "Subline preview text goes here..."}
          </p>
          <Pipetter
            id="hero-subline-color"
            color={sublineColor}
            setColor={setSublineColor}
            label="Subline color"
          />
        </div>
      </div>
    </section>
  );
}
