import { request } from "./client.api";

export type CartProductImage = {
  url: string;
  altText: string | null;
  isThumbnail: boolean;
  sortOrder: number;
};

export type CartProduct = {
  name: string;
  description: string;
  price: string | number;
  isActive: boolean;
  productImages: CartProductImage[];
};

export type CartItem = {
  id: string;
  productId: number;
  quantity: number;
  product: CartProduct;
};

export type Cart = {
  userId: string;
  items: CartItem[];
};

export function getCart() {
  return request<Cart | []>("/carts");
}
