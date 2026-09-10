import { request } from "./client.api";

export type ProductImage = {
  id?: number;
  productId?: number;
  url: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isThumbnail: boolean;
};

export type Product = {
  productId: number;
  name: string;
  slug: string | null;
  sku: string | null;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  productImages: ProductImage[];
  category: { categoryId: number; name: string } | null;
  stock: number;
};

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductListResponse = {
  items: Product[];
  pagination: ProductPagination;
};

export type ProductSearchParams = {
  page: number;
  limit: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  inStock?: boolean;
  sortBy?: "productId" | "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export function getProducts(params: ProductSearchParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  return request<ProductListResponse>(`/products?${searchParams.toString()}`);
}

export function getProduct(productId: number) {
  return request<Product>(`/products/${productId}`);
}

export function getProductsCount() {
  return request<{ count: number }>("/products/count");
}

export type AdminProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: "active" | "inactive";
  stock?: "in" | "low" | "out";
  sortBy?: "name" | "price" | "stock" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type AdminProductListResponse = ProductListResponse & {
  statistics: {
    all: number;
    active: number;
    outOfStock: number;
    lowStock: number;
  };
};

export function getAdminProducts(params: AdminProductListParams = {}) {
  const searchParams = new URLSearchParams();
  Object.entries({ page: 1, limit: 20, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      searchParams.set(key, String(value));
  });
  return request<AdminProductListResponse>(
    `/admin/products?${searchParams.toString()}`,
  );
}

export function getAdminProduct(productId: number) {
  return request<Product>(`/admin/products/${productId}`);
}

export function createAdminProduct(data: FormData) {
  return request<Product>("/admin/products", { method: "POST", body: data });
}

export function updateAdminProduct(
  productId: number,
  data: Partial<
    Pick<
      Product,
      "name" | "slug" | "sku" | "description" | "price" | "isActive"
    > & {
      categoryId: number | null;
    }
  >,
) {
  return request<{ item: Product }>(`/admin/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function updateAdminProductInventory(
  productId: number,
  stock: number,
  reorderAt: number,
) {
  return request<{ stock: number }>(`/admin/inventory/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ stock, reorderAt }),
  });
}

export function deleteAdminProduct(productId: number) {
  return request<{ message: string }>(`/admin/products/${productId}`, {
    method: "DELETE",
  });
}

export function updateAdminProductImage(
  productId: number,
  imageId: number,
  data: FormData,
) {
  return request<ProductImage>(
    `/admin/products/${productId}/images/${imageId}`,
    { method: "PATCH", body: data },
  );
}

export async function getRecommendedProducts(
  limit: number = 4,
): Promise<Product[]> {
  return request<Product[]>(`/products/recommended?limit=${limit}`);
}
