"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useDict } from "@/i18n/context";
import type { HomeProduct } from "@/types/product";
import { slugify } from "@/lib/slugify";
import Image from "next/image";
import { Pipette, ImageUp } from "lucide-react";

interface AdminGridProps {
  config: HomeProduct;
  index: number;
  // colors
  titleColor: string;
  setTitleColor: (c: string) => void;
  descColor: string;
  setDescColor: (c: string) => void;
  badgeColor: string;
  setBadgeColor: (c: string) => void;
  btn1Color: string;
  setBtn1Color: (c: string) => void;
  btn1BgColor: string;
  setBtn1BgColor: (c: string) => void;
  btn2Color: string;
  setBtn2Color: (c: string) => void;
  btn2BgColor: string;
  setBtn2BgColor: (c: string) => void;
  backgroundColor: string;
  setBackgroundColor: (c: string) => void;
  // image
  uploading: boolean;
  onUpload: (file: File) => void;
}

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
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/90 shadow cursor-pointer hover:bg-white transition-colors shrink-0"
      style={{ border: `2px solid ${color}` }}
    >
      <Pipette size={11} className="text-black/70" />
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

export default function ProductGridItemAdmin({
  config,
  index,
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
  onUpload,
}: AdminGridProps) {
  const dict = useDict();
  const productSlug = slugify(config.title);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <article
      className="relative flex flex-col items-center justify-start overflow-hidden min-h-145 p-8 group"
      style={{ backgroundColor }}
    >
      {/* background image */}
      <div className="absolute inset-0">
        <Image
          src={config.imgUrl}
          alt={config.title}
          fill
          className="z-0 object-cover"
          objectFit="cover"
        />
      </div>

      {/* bg color pipette — top-right corner */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
        <span className="text-[10px] text-white/70 font-medium">BG</span>
        <Pipetter
          id={`grid-bg-${index}`}
          color={backgroundColor}
          setColor={setBackgroundColor}
          label="Background color"
        />
      </div>

      {/* upload overlay — center */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="absolute w-full h-max py-10 bottom-0 z-20 flex flex-col items-center justify-center gap-2 opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px] cursor-pointer"
      >
        {uploading ? (
          <span className="text-white text-sm font-medium animate-pulse">
            Uploading…
          </span>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
              <ImageUp size={18} className="text-black/70" />
            </div>
            <span className="text-white text-xs font-medium drop-shadow">
              Change image
            </span>
          </>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />

      {/* content */}
      <div className="max-w-75 relative text-center flex flex-col items-center justify-center z-10">
        {config.badge && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: badgeColor }}
            >
              {config.badge}
            </span>
            <Pipetter
              id={`grid-badge-${index}`}
              color={badgeColor}
              setColor={setBadgeColor}
              label="Badge color"
            />
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <h3
            className="text-2xl sm:text-3xl font-bold leading-snug"
            style={{ color: titleColor }}
          >
            {config.title}
          </h3>
          <Pipetter
            id={`grid-title-${index}`}
            color={titleColor}
            setColor={setTitleColor}
            label="Title color"
          />
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <p className="text-lg leading-relaxed" style={{ color: descColor }}>
            {config.desc}
          </p>
          <Pipetter
            id={`grid-desc-${index}`}
            color={descColor}
            setColor={setDescColor}
            label="Description color"
          />
        </div>

        <div className="mt-5 flex items-center gap-4">
          {/* btn 1 */}
          <div className="flex flex-col items-center gap-1">
            <Button variant="primary" size="sm" type="button">
              {dict.grid.learnMore}
            </Button>
          </div>
          {/* btn 2 */}
          <div className="flex flex-col items-center gap-1">
            <Button variant="primary" size="sm" type="button">
              {dict.grid.buy}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
