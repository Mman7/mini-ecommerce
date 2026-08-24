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
  productId?: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  productImages: ProductImage[];
};

export type ProductSearchParams = {
  page: number;
  limit: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
};

export function getProducts(params: ProductSearchParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  return request<Product[]>(`/products?${searchParams.toString()}`);
}

export function getProduct(productId: number) {
  return request<Product>(`/products/${productId}`);
}

export function getProductsCount() {
  return request<{ count: number }>("/products/count");
}
