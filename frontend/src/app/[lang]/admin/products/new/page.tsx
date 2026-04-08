"use client";

import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        New product
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
