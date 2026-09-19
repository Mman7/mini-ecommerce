import { request } from "./client.api";

export type Category = {
  categoryId: number;
  name: string;
};

export type AdminCategory = Category & {
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  productCount: number;
};

export type AdminCategoryListResponse = {
  items: AdminCategory[];
  statistics: { all: number; active: number };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const categoryApi = {
  list: () => request<Category[]>("/categories"),
  admin: {
    list: (
      params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: "active" | "inactive";
        sortBy?: "name" | "createdAt" | "updatedAt";
        sortOrder?: "asc" | "desc";
      } = {},
    ) => {
      const searchParams = new URLSearchParams();
      Object.entries({ page: 1, limit: 20, ...params }).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== "")
            searchParams.set(key, String(value));
        },
      );
      return request<AdminCategoryListResponse>(
        `/admin/categories?${searchParams.toString()}`,
      );
    },
    get: (categoryId: number) =>
      request<
        AdminCategory & {
          products: Array<{
            productId: number;
            name: string;
            price: number;
            stock: number;
          }>;
        }
      >(`/admin/categories/${categoryId}`),
    create: (data: { name: string }) =>
      request<AdminCategory>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (categoryId: number, data: { name?: string; isActive?: boolean }) =>
      request<AdminCategory>(`/admin/categories/${categoryId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (categoryId: number) =>
      request<{ message: string }>(`/admin/categories/${categoryId}`, {
        method: "DELETE",
      }),
  },
};
