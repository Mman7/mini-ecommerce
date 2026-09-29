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
  cancellationRequestedAt: string | null;
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
    slug: string;
    name: string;
    collection?: string | null;
    productImages: { url: string; isThumbnail: boolean }[];
  };
};

export const orderApi = {
  create: (orderProduct: OrderItemInput[], addressId: number) =>
    request<{ msg: string; order: Order }>("/orders", {
      method: "POST",
      body: JSON.stringify({ orderProduct, addressId }),
    }),
  get: (orderId: string) =>
    request<{ msg: string; order: Order }>(`/orders/${orderId}`),
  listMine: () => request<{ msg: string; orders: Order[] }>("/orders/mine"),
  requestCancellation: (orderId: string) =>
    request<{
      msg: string;
      order: Pick<Order, "id" | "status" | "cancellationRequestedAt">;
    }>(`/orders/${orderId}/cancellation-request`, { method: "POST" }),
  admin: {
    list: (
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
    ) => {
      const searchParams = new URLSearchParams();
      Object.entries({ page: 1, limit: 20, ...params }).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== "")
            searchParams.set(key, String(value));
        },
      );
      return request<AdminOrderListResponse>(
        `/admin/orders?${searchParams.toString()}`,
      );
    },
    get: (orderId: string) =>
      request<
        Order & {
          user: {
            userId: string;
            name: string;
            email: string;
            phoneNumber: string | null;
            ordersCount: number;
          };
          stripePaymentIntentId: string | null;
          deliveryAddressLine1: string;
          deliveryAddressLine2: string | null;
          deliveryFee: number;
          deliveryCity: string;
          deliveryState: string | null;
          deliveryPostcode: string;
          deliveryCountry: string;
        }
      >(`/admin/orders/${orderId}`),
    updateStatus: (orderId: string, status: string) =>
      request<Order>(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    cancel: (orderId: string) =>
      request<{ order: Order; refundStatus: string | null }>(
        `/admin/orders/${orderId}/cancel`,
        { method: "PATCH" },
      ),
    approveCancellationRequest: (orderId: string) =>
      request<{ order: Order; refundStatus: string | null }>(
        `/admin/orders/${orderId}/cancellation-request/approve`,
        { method: "POST" },
      ),
    rejectCancellationRequest: (orderId: string) =>
      request<Order>(`/admin/orders/${orderId}/cancellation-request/reject`, {
        method: "POST",
      }),
    refund: (orderId: string) =>
      request<{
        status: string;
        refundId: string | null;
        alreadyRefunded: boolean;
      }>(`/admin/orders/${orderId}/refund`, { method: "POST" }),
  },
};
