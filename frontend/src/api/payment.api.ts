import { request } from "./client.api";

export type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
};

export type PaymentStatusResponse = {
  status: string;
  order: { id: string } | null;
};

export const paymentApi = {
  createIntent: (addressId: number) =>
    request<PaymentIntentResponse>("/payments/intent", {
      method: "POST",
      body: JSON.stringify({ addressId }),
    }),
  status: (paymentIntentId: string) =>
    request<PaymentStatusResponse>(`/payments/${paymentIntentId}`),
};
