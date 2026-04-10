"use client";

import { useDict } from "@/i18n/context";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import type { HomeProduct } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { ProductOrderDialog } from "@/components/ui/ProductOrderDialog";
import { useParams } from "next/navigation";

export default function ProductShowcaseItem({
  config,
  reversed,
}: {
  config: HomeProduct;
  reversed: boolean;
}) {
  const { lang } = useParams<{ lang: string }>();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const dict = useDict();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="relative flex items-center justify-center gap-12 lg:gap-20 px-6 lg:px-20 py-13.5 overflow-hidden"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <motion.div
          className="max-w-150 min-h-155 flex-1 text-center z-10"
          initial={{ opacity: 0, x: reversed ? 40 : -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {config.badge && (
            <span
              className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase"
              style={{ color: config.badgeColor }}
            >
              {config.badge}
            </span>
          )}
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: config.titleColor }}
          >
            {config.title}
          </h2>
          <p
            className="mt-2 text-2xl sm:text-3xl font-semibold"
            style={{ color: config.descColor }}
          >
            {config.desc}
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            {config.hasContent && (
              <Button
                variant="primary"
                href={`/${lang}/categories/${config?.categories?.[0]?.slug}/${config.slug}`}
                size="lg"
                style={{
                  color: config.btn1Color,
                  backgroundColor: config.btn1BgColor,
                }}
                className="border-black"
              >
                {dict.showcase.learnMore}
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              style={{
                color: config.btn2Color,
                backgroundColor: config.btn2BgColor,
              }}
              className="border-black"
              onClick={() => setDialogOpen(true)}
            >
              {dict.showcase.buy}
            </Button>
          </div>
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={config.imgUrl}
            alt={config.title}
            fill
            className="z-0 w-full h-full"
            objectFit="cover"
          />
        </div>
      </section>

      {dialogOpen && (
        <ProductOrderDialog
          productId={Number(config.id)}
          productTitle={config.title}
          btn2Color={config.btn2Color}
          btn2BgColor={config.btn2BgColor}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
