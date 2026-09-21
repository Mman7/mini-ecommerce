import type { ProductPagination } from "../../api/product.api";
import Pagination from "../ui/Pagination";

export default function ProductsPagination({
  pagination,
  query,
}: {
  pagination: ProductPagination;
  query: string;
}) {
  return (
    <Pagination
      page={pagination.page}
      totalPages={pagination.totalPages}
      total={pagination.total}
      query={query}
    />
  );
}
