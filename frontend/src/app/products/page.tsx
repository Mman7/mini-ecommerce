import { Suspense } from "react";
import ProductsCatalog from "../../components/sections/ProductsCatalog";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="padding-inline py-40 text-center">
          <p className="text-text-muted">Loading the collection...</p>
        </main>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
