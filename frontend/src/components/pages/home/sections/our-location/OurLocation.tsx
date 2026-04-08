"use client";

import { motion } from "framer-motion";
import { useDict } from "@/i18n/context";
import { MAP_DEFAULT_CENTER } from "@/constants";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: {
    duration: 0.65,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    delay,
  },
});

interface Props {
  lat: number | null;
  lng: number | null;
}

export function OurLocation({ lat, lng }: Props) {
  const dict = useDict();
  const d = dict.ourLocation;

  const currentLat = lat ?? MAP_DEFAULT_CENTER[0];
  const currentLng = lng ?? MAP_DEFAULT_CENTER[1];

  // Format: pt=longitude,latitude,icon_style
  const markerParam = `pt=${currentLng},${currentLat},pm2rdm`;
  const centerParam = `ll=${currentLng},${currentLat}`;

  const mapUrl = `https://yandex.com/map-widget/v1/?${centerParam}&z=16&${markerParam}`;

  return (
    <section id="our-location" className="py-28 bg-white">
      <div className="mx-4">
        {/* Section header */}
        <motion.div className="text-center mb-12" {...fadeUp()}>
          <span className="inline-block mb-4 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            {d.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] leading-tight">
            {d.headline}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-[#6e6e73] leading-relaxed">
            {d.subline}
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          className="overflow-hidden shadow-2xl shadow-black/10 border border-black/6"
          style={{ height: 480 }}
          {...fadeUp(0.15)}
        >
          <iframe
            title="Siraj Store Location"
            src={mapUrl}
            width="100%"
            height="100%"
            loading="lazy"
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-full border-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
