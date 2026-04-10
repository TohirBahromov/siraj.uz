import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { hasLocale, type Locale } from "@/i18n/config";
import { fetchLeafCategoryTree } from "@/api/categories-api";
import type { PublicCategoryNode } from "@/types/category";

export const dynamic = "force-dynamic";

function CategoryCard({
  category,
  lang,
}: {
  category: PublicCategoryNode;
  lang: string;
}) {
  return (
    <Link
      href={`/${lang}/categories/${category.slug}`}
      className="group flex flex-col items-center gap-3"
    >
      {/* Circular image */}
      <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#f5f5f7] border border-black/6 group-hover:border-black/20 group-hover:shadow-md transition-all duration-300">
        {category.imgUrl ? (
          <Image
            src={category.imgUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/20 text-4xl font-light">
            {category.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name below image */}
      <span className="text-sm font-medium text-[#1d1d1f] text-center leading-snug group-hover:text-black transition-colors">
        {category.name}
      </span>
    </Link>
  );
}

export default async function CategoriesPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const leaves = await fetchLeafCategoryTree(locale);

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 mt-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            Categories
          </h1>
          <p className="mt-3 text-base text-black/50">
            Browse our full range of products by category.
          </p>
        </div>

        {leaves.length === 0 ? (
          <p className="text-black/40 text-center py-20">
            No categories available yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {leaves.map((cat) => (
              <CategoryCard key={cat.id} category={cat} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
