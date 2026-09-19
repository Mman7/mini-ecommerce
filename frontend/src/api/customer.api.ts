import { request, requestBlob } from "./client.api";

export type CustomerStatus = "Regular" | "VIP" | "Inactive";

export type Customer = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  orders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: CustomerStatus;
};

export type CustomerStats = {
  total: number;
  newThisMonth: number;
  newGrowth: number;
  repeat: number;
  repeatRate: number;
  vip: number;
  vipRate: number;
};

export type CustomerDetail = Customer & {
  averageOrderValue: number;
  orderHistory: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    itemCount: number;
  }>;
};

export type CustomerListResponse = {
  items: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: CustomerStats;
};

export type CustomerQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "regular" | "vip" | "inactive";
  sort?:
    | "newest"
    | "oldest"
    | "nameAsc"
    | "nameDesc"
    | "orders"
    | "spending"
    | "latestOrder";
  order?: "asc" | "desc";
};

function queryString(params: CustomerQuery) {
  const searchParams = new URLSearchParams();
  Object.entries({ page: 1, limit: 20, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export const customerApi = {
  admin: {
    list: (params: CustomerQuery = {}) =>
      request<CustomerListResponse>(`/admin/customers?${queryString(params)}`),
    get: (id: string) => request<CustomerDetail>(`/admin/customers/${id}`),
    update: (
      id: string,
      updates: { name: string; email: string; phoneNumber: string | null },
    ) =>
      request<CustomerDetail>(`/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    updateStatus: (id: string, isActive: boolean) =>
      request<CustomerDetail>(`/admin/customers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
    export: (params: CustomerQuery = {}) =>
      requestBlob(`/admin/customers/export?${queryString(params)}`),
  },
};
