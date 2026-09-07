import { request } from "./client.api";

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  total: string | number;
  status: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderListResponse = {
  items: Array<
    Order & {
      user: {
        userId: string;
        name: string;
        email: string;
        phoneNumber: string | null;
      };
      itemCount: number;
      total: number;
    }
  >;
  statistics: Record<string, number>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: string | number;
  product: {
    name: string;
    productImages: { url: string; isThumbnail: boolean }[];
  };
};

export function createOrder(orderProduct: OrderItemInput[], addressId: number) {
  return request<{ msg: string; order: Order }>("/orders", {
    method: "POST",
    body: JSON.stringify({ orderProduct, addressId }),
  });
}

export function getOrder(orderId: string) {
  return request<{ msg: string; order: Order }>(`/orders/${orderId}`);
}

export function getMyOrders() {
  return request<{ msg: string; orders: Order[] }>("/orders/mine");
}

export function cancelOrder(orderId: string) {
  return request<{ msg: string; order: Order }>(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
}

export function getAdminOrders(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    from?: string;
    to?: string;
    sortBy?: "createdAt" | "total";
    sortOrder?: "asc" | "desc";
  } = {},
) {
  const searchParams = new URLSearchParams();
  Object.entries({ page: 1, limit: 20, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      searchParams.set(key, String(value));
  });
  return request<AdminOrderListResponse>(
    `/admin/orders?${searchParams.toString()}`,
  );
}

export function getAdminOrder(orderId: string) {
  return request<
    Order & {
      user: {
        userId: string;
        name: string;
        email: string;
        phoneNumber: string | null;
      };
      deliveryAddressLine1: string;
      deliveryAddressLine2: string | null;
      deliveryCity: string;
      deliveryState: string | null;
      deliveryPostcode: string;
      deliveryCountry: string;
    }
  >(`/admin/orders/${orderId}`);
}

export function updateAdminOrderStatus(orderId: string, status: string) {
  return request<Order>(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function cancelAdminOrder(orderId: string) {
  return request<Order>(`/admin/orders/${orderId}/cancel`, { method: "PATCH" });
}
