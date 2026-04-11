import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  fetchCategoryBySlug,
  fetchCategoryProductsPage,
} from "@/api/categories-api";
import { CategoryProductList } from "@/components/pages/category/CategoryProductList";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: PageProps<"/[lang]/categories/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;

  let category;
  try {
    category = await fetchCategoryBySlug(slug, locale);
  } catch {
    notFound();
  }

  const [{ products: initialProducts, nextCursor: initialNextCursor }, dict] =
    await Promise.all([
      fetchCategoryProductsPage(slug, locale),
      getDictionary(locale),
    ]);
  const d = dict.categories;

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-black/40 mt-10">
          <Link
            href={`/${lang}/categories`}
            className="hover:text-black transition-colors"
          >
            {d.breadcrumb}
          </Link>
          <span>/</span>
          <span className="text-[#1d1d1f] font-medium">{category.name}</span>
        </nav>

        {/* Hero */}
        <div className="flex items-start gap-8 mb-14">
          {category.imgUrl && (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f7] shrink-0 border border-black/8">
              <Image
                src={category.imgUrl}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              {category.name}
            </h1>
            {initialProducts.length > 0 && (
              <p className="mt-2 text-black/40">
                {initialProducts.length}+ {d.productsCount}
              </p>
            )}
          </div>
        </div>

        {/* Products with cursor pagination */}
        <CategoryProductList
          initialProducts={initialProducts}
          initialNextCursor={initialNextCursor}
          categorySlug={slug}
          lang={lang}
          locale={locale}
          noProductsText={d.noProducts}
          loadMoreText={d.loadMore}
        />
      </div>
    </main>
  );
}
