import type { Category } from "../../api/category.api";
import FiltersSidebar from "./FiltersSidebar";

export default function ProductsAside({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <aside className="md:col-span-3">
      <FiltersSidebar categories={categories} />
    </aside>
  );
}
