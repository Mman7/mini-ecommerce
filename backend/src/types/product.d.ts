export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
};

export type ProductUpdate = {
  name?: string;
  description?: string;
  price?: number;
};
