"use client";

import { useDict } from "@/i18n/context";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const dict = useDict();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {dict.admin.products.newTitle}
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
