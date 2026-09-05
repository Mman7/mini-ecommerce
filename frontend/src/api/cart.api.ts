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
  stock: number;
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

export type CartResponse = Cart | [];

export function normalizeCart(response: CartResponse): Cart {
  return Array.isArray(response) ? { userId: "", items: [] } : response;
}

export function getCart() {
  return request<CartResponse>("/carts");
}

export async function addCartItem(productId: number, quantity: number) {
  const response = await request<Cart | { msg: string; cart: Cart }>("/carts", {
    method: "POST",
    body: JSON.stringify({ item: { productId, quantity } }),
  });
  return "cart" in response ? response.cart : response;
}

export function updateCartItem(itemId: string, quantity: number) {
  return request<Cart>(`/carts/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string) {
  const response = await request<{ message: string; cart: Cart }>(
    `/carts/${itemId}`,
    { method: "DELETE" },
  );
  return response.cart;
}
