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
