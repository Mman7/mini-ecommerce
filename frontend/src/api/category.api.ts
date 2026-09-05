import { request } from "./client.api";

export type Category = {
  categoryId: number;
  name: string;
};

export function getCategories() {
  return request<Category[]>("/categories");
}
