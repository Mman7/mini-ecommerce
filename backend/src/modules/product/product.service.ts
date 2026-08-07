import { prisma } from "../../utils/prisma.ts";
import type { Product, ProductSearchQuery } from "../../types/product.js";
import type { ProductUpdateInput } from "../../generated/prisma/models.ts";
export const createProduct = ({ name, description, price }: Product) => {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
    },
  });
};

export const getProductById = (id: number) => {
  return prisma.product.findUnique({
    where: { productId: id },
  });
};

export const getProducts = ({
  page,
  limit,
  maxPrice,
  minPrice,
  name,
}: ProductSearchQuery) => {
  return prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      AND: [
        { name: { contains: name, mode: "insensitive" } },
        { price: { gte: minPrice ?? 0, lte: maxPrice ?? Number.MAX_VALUE } },
      ],
    },
    orderBy: {
      productId: "asc",
    },
  });
};

export const updateProductById = (id: number, data: ProductUpdateInput) => {
  return prisma.product.update({
    where: { productId: id },
    data,
  });
};

export const deleteProductById = (id: number) => {
  return prisma.product.delete({
    where: { productId: id },
  });
};

export const searchProductsByName = ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}) => {
  return prisma.product.findMany({
    where: {
      OR: [{ name: { contains: query, mode: "insensitive" } }],
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      productId: "asc",
    },
  });
};

export const searchBetweenPrice = ({
  minPrice,
  maxPrice,
  page,
  limit,
}: {
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
}) => {
  return prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      productId: "asc",
    },
  });
};

export const getProductsCount = () => {
  return prisma.product.count();
};
