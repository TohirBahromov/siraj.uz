import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fetchProductBySlugId, fetchProductContent } from "@/api/products-api";
import { OrderForm } from "@/components/pages/product/OrderForm";
import { ContentRenderer } from "@/components/pages/product/ContentRenderer";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: PageProps<"/[lang]/categories/[slug]/[productSlugId]">) {
  const { lang, slug, productSlugId } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;

  const [dict, contentBlocks] = await Promise.all([
    getDictionary(locale),
    fetchProductContent(productSlugId, locale),
  ]);

  let product;
  try {
    product = await fetchProductBySlugId(productSlugId, locale);
  } catch {
    notFound();
  }

  const primaryCategory = product.categories[0];
  const categorySlug = primaryCategory?.slug ?? slug;
  const categoryName = primaryCategory?.name ?? "Category";

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <Container className="px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-10 mt-10 flex items-center gap-2 text-sm text-black/40 flex-wrap">
          <Link
            href={`/${lang}/categories`}
            className="hover:text-black transition-colors"
          >
            Categories
          </Link>
          <span>/</span>
          <Link
            href={`/${lang}/categories/${categorySlug}`}
            className="hover:text-black transition-colors"
          >
            {categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#1d1d1f] font-medium">{product.title}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: product.backgroundColor }}
          >
            <Image
              src={product.imgUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.badge && (
              <span
                className="text-sm font-medium mb-3 block"
                style={{ color: product.badgeColor }}
              >
                {product.badge}
              </span>
            )}
            <h1
              className="text-4xl font-semibold tracking-tight mb-4"
              style={{ color: product.titleColor }}
            >
              {product.title}
            </h1>
            <p
              className="text-lg leading-relaxed mb-8 whitespace-pre-wrap"
              style={{ color: product.descColor }}
            >
              {product.desc}
            </p>

            <OrderForm
              productId={product.id}
              productTitle={product.title}
              label={dict.product.orderBtn}
              btn1Color={product.btn1Color}
              btn1BgColor={product.btn1BgColor}
            />
          </div>
        </div>
      </Container>

      {/* Rich content blocks */}
      <ContentRenderer blocks={contentBlocks} />
    </main>
  );
}
