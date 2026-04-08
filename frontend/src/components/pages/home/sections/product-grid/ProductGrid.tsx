import ProductGridItem from "@/components/templates/ProductGridItem";
import type { HomeProduct } from "@/types/product";

export function ProductGrid({ products }: { products: HomeProduct[] }) {
  if (products.length <= 0) return null;

  return (
    <section className="bg-white mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4">
        {products.map((config, i) => (
          <ProductGridItem key={config.id} config={config} index={i} />
        ))}
      </div>
    </section>
  );
}
