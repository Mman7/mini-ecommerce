import { request } from "./client.api";

export type Favourite = {
  id: number;
  userId: string;
  productId: number;
  createdAt: string;
};

export function getFavourites() {
  return request<{ favourites: Favourite[] }>("/favourites");
}

export function addFavourite(productId: number) {
  return request<{ favourite: Favourite }>("/favourites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function removeFavourite(productId: number) {
  return request<{ message: string }>(`/favourites/${productId}`, {
    method: "DELETE",
  });
}
