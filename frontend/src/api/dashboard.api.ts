import { request } from "./client.api";

export type DashboardOverview = {
  summary: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  previousSummary: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
  };
  catalog: { totalActiveProducts: number; inStockProducts: number };
  revenueTrend: { date: string; amount: number; orderCount: number }[];
  fulfillmentBreakdown: {
    status: string;
    count: number;
    percentage: number;
  }[];
  categoryRevenue: {
    categoryId: number;
    name: string;
    revenue: number;
    percentage: number;
  }[];
  cohortMetrics: {
    repeatRate: number;
    newCustomerRate: number;
    estimatedClv: number;
  };
  topProducts: {
    productId: number;
    name: string;
    price: number;
    sold: number;
    revenue: number;
    orderCount: number;
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

export const dashboardApi = {
  overview: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return request<DashboardOverview>(`/admin/overview?${params.toString()}`);
  },
};
