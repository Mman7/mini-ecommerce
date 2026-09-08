import { request } from "./client.api";

export type CustomerStatus = "Regular" | "VIP" | "Inactive";

export type Customer = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
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

export function getAdminCustomers(params: CustomerQuery = {}) {
  return request<CustomerListResponse>(
    `/admin/customers?${queryString(params)}`,
  );
}

export function getAdminCustomer(id: string) {
  return request<CustomerDetail>(`/admin/customers/${id}`);
}

export function updateAdminCustomer(
  id: string,
  updates: { name: string; email: string; phoneNumber: string | null },
) {
  return request<CustomerDetail>(`/admin/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function updateAdminCustomerStatus(id: string, isActive: boolean) {
  return request<CustomerDetail>(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export async function exportAdminCustomers(params: CustomerQuery = {}) {
  const response = await fetch(
    `/api/admin/customers/export?${queryString(params)}`,
    { credentials: "include" },
  );
  if (!response.ok) throw new Error("Unable to export customers");
  return response.blob();
}
