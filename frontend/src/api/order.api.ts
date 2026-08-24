import { request } from "./client.api";

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export function createOrder(orderProduct: OrderItemInput[]) {
  return request<{ msg: string; order: Order }>("/orders", {
    method: "POST",
    body: JSON.stringify({ orderProduct }),
  });
}

export function getOrder(orderId: string) {
  return request<{ msg: string; order: Order }>(`/orders/${orderId}`);
}

export function cancelOrder(orderId: string) {
  return request<{ msg: string; order: Order }>(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
}
