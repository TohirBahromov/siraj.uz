"use client";

import { useState } from "react";
import { ProductOrderDialog } from "@/components/ui/ProductOrderDialog";

interface Props {
  productId: number;
  btn1Color: string;
  btn1BgColor: string;
}

export function OrderForm({ productId, btn1Color, btn1BgColor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ color: btn1Color, backgroundColor: btn1BgColor }}
        className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
      >
        Order Now
      </button>

      {open && (
        <ProductOrderDialog
          productId={productId}
          productTitle=""
          btn2Color={btn1Color}
          btn2BgColor={btn1BgColor}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
