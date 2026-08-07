export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
  isActive?: boolean;
};

export type ProductSearchQuery = {
  page: number;
  limit: number;
  name: string;
  minPrice?: number;
  maxPrice?: number;
};
