"use client";

import { useDict } from "@/i18n/context";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  const dict = useDict();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        {dict.admin.categories.newTitle}
      </h1>
      <CategoryForm mode="create" />
    </div>
  );
}
