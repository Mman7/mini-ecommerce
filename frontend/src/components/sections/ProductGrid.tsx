import ProductCard from "../ui/ProductCard";
import type { Product } from "../../types/product";

export const PRODUCT_GRID_CLASS =
  "grid grid-cols-2 gap-x-3 gap-y-4 min-[820px]:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] min-[820px]:gap-x-5 min-[820px]:gap-y-6";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={PRODUCT_GRID_CLASS}>
      {products.map((p) => (
        <ProductCard key={p.productId} product={p} />
      ))}
    </div>
  );
}
