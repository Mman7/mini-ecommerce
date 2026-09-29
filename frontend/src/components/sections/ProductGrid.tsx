import ProductCard from "../ui/ProductCard";
import type { Product } from "../../types/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {/* TODO fix favoroute error  */}
      {/* TODO fix favoroute error  */}
      {products.map((p) => (
        <ProductCard key={p.productId} product={p} />
      ))}
    </div>
  );
}
