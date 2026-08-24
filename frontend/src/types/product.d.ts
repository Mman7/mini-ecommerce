export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  rating?: number;
  label?: string;
  variant?: "new" | "sale" | "limited" | "bestseller" | "cozy" | "collector";
}

export type Products = Product[];
