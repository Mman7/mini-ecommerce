import { request } from "./client.api";

export type DashboardOverview = {
  summary: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  revenueTrend: { date: string; amount: number }[];
  topProducts: {
    productId: number;
    name: string;
    price: number;
    sold: number;
    image: { url: string; altText: string | null } | null;
  }[];
  recentOrders: {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: string;
  }[];
  lowStock: {
    productId: number;
    name: string;
    stock: number;
    reorderAt: number;
    image: { url: string; altText: string | null } | null;
  }[];
};

export function getDashboardOverview(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return request<DashboardOverview>(`/admin/overview?${params.toString()}`);
}
