"use client";

import { useDict } from "@/i18n/context";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ProductOrderDialog } from "@/components/ui/ProductOrderDialog";
import type { HomeProduct } from "@/types/product";
import Image from "next/image";
import { useParams } from "next/navigation";
import { slugify } from "@/lib/slugify";

interface Props {
  config: HomeProduct;
  index: number;
}

export default function ProductGridItem({ config, index }: Props) {
  const { lang } = useParams<{ lang: string }>();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const dict = useDict();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative flex flex-col justify-start overflow-hidden min-h-145 p-8 group"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={config.imgUrl}
            alt={config.title}
            fill
            className="z-0 w-full h-full"
            objectFit="cover"
          />
        </div>

        <div className="relative text-center flex flex-col items-center justify-center z-10">
          <h3
            className="text-2xl sm:text-3xl font-bold leading-snug"
            style={{ color: config.titleColor }}
          >
            {config.title}
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: config.descColor }}
          >
            {config.desc}
          </p>
          <div className="mt-5 flex items-center gap-4">
            {config.hasContent && (
              <Button
                variant="primary"
                href={`/${lang}/categories/${config?.categories[0]?.slug}/${config.slug}`}
                size="sm"
                style={{
                  color: config.btn1Color,
                  backgroundColor: config.btn1BgColor,
                  border: "none",
                }}
              >
                {dict.grid.learnMore}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              style={{
                color: config.btn2Color,
                backgroundColor: config.btn2BgColor,
                border: "none",
              }}
              onClick={() => setDialogOpen(true)}
            >
              {dict.grid.buy}
            </Button>
          </div>
        </div>
      </motion.article>

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
