import ProductShowcaseItem from "@/components/templates/ProductShowcaseItem";
import type { HomeProduct } from "@/types/product";

export function ProductShowcase({ products }: { products: HomeProduct[] }) {
  if(products.length <= 0) return null

  return (
    <div className="bg-white divide-y divide-black/8 flex flex-col gap-4 mb-4">
      {products.map((config, index) => (
        <ProductShowcaseItem
          key={config.id}
          config={config}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  );
}
