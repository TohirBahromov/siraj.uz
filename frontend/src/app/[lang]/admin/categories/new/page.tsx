"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        New Category
      </h1>
      <CategoryForm mode="create" />
    </div>
  );
}
