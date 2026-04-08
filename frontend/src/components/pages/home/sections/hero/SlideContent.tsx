import { PublicHeroSlide } from "@/types/hero-slide";
import { motion } from "framer-motion";

function SlideContent({ config }: { config: PublicHeroSlide }) {
  return (
    <motion.div
      key={config.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      <span
        className="mb-4 text-sm font-medium tracking-widest uppercase"
        style={{ color: config.eyebrowColor }}
      >
        {config.eyebrow}
      </span>

      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight whitespace-pre-line"
        style={{ color: config.headlineColor }}
      >
        {config.headline}
      </h1>

      <p
        className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed"
        style={{ color: config.sublineColor }}
      >
        {config.subline}
      </p>
    </motion.div>
  );
}

export default SlideContent;
