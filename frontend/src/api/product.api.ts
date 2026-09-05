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

export async function getRecommendedProducts(
  limit: number = 4,
): Promise<Product[]> {
  return request<Product[]>(`/products/recommended?limit=${limit}`);
}
