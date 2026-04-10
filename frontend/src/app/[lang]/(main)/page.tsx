import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { Hero } from "@/components/pages/home/sections/hero/Index";
import { ProductShowcase } from "@/components/pages/home/sections/product-showcase/ProductShowcase";
import { ProductGrid } from "@/components/pages/home/sections/product-grid/ProductGrid";
import { ContactUs } from "@/components/pages/home/sections/contact-us/ContactUs";
import { OurLocation } from "@/components/pages/home/sections/our-location/OurLocation";
import { fetchHomeProducts } from "@/api/products-api";
import { fetchHeroSlides } from "@/api/hero-slides-api";
import { getContact, getMap } from "@/api/company-api";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const [showcaseProductsRaw, gridProductsRaw, heroSlides, contact, map] =
    await Promise.all([
      fetchHomeProducts("SHOWCASE", locale),
      fetchHomeProducts("GRID", locale),
      fetchHeroSlides(locale),
      getContact(),
      getMap(),
    ]);

  const showcaseProducts = showcaseProductsRaw.slice(0, 3);
  const gridProducts = gridProductsRaw.slice(0, 6);

  return (
    <>
      <Hero slides={heroSlides} />
      <ProductShowcase products={showcaseProducts} />
      <ProductGrid products={gridProducts} />
      <ContactUs contact={contact} />
      <OurLocation lat={map.latitude} lng={map.longitude} />
    </>
  );
}
