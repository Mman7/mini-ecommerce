export type Order = {
  readonly id: string;
  userId: string;
  total: number;
  status: string;
  deliveryName: string | null;
  deliveryAddressLine1: string | null;
  deliveryAddressLine2: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  deliveryPostcode: string | null;
  deliveryCountry: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type CreateOrderInput = {
  orderProduct: OrderItemInput[];
  addressId: number;
};
