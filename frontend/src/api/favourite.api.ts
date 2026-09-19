import { request } from "./client.api";
import type { Product } from "./product.api";

export type Favourite = {
  id: number;
  userId: string;
  productId: number;
  createdAt: string;
  product: Product | null;
};

export const favouriteApi = {
  list: () =>
    request<{ favourites: Favourite[] }>("/favourites").catch(() => ({
      favourites: [],
    })),
  add: (productId: number) =>
    request<{ favourite: Favourite }>("/favourites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  remove: (productId: number) =>
    request<{ message: string }>(`/favourites/${productId}`, {
      method: "DELETE",
    }),
};
