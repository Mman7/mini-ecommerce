export type Order = {
  readonly id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemInput = {
  productId: number;
  quantity: number;
};
