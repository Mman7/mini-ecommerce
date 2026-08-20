export type ProductImage = {
  id?: number;
  productId?: number;
  url: string;
  altText: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  isThumbnail: boolean;
};

export type Product = {
  productId?: number;
  name: string;
  description: string;
  price: number; // Decimal is typically represented as number in API responses
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  productImages: ProductImage[];
};

export type ProductSearchQuery = {
  page: number;
  limit: number;
  name: string;
  minPrice?: number;
  maxPrice?: number;
};
