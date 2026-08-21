import { prisma } from "../../utils/prisma.ts";
import { deleteFileByPath } from "../file/file.service.ts";
import type { Product, ProductSearchQuery } from "../../types/product.js";
import type { ProductUpdateInput } from "../../generated/prisma/models.ts";

export const getTotalProducts = async () => {
  const totalProducts = await prisma.product.count();
  return totalProducts;
};

export const createProduct = ({
  name,
  description,
  price,
  productImages,
}: Product) => {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
      productImages: {
        create: productImages.map(
          ({ url, altText, sortOrder, isThumbnail }) => ({
            url,
            altText,
            sortOrder,
            isThumbnail,
          }),
        ),
      },
    },
    include: {
      productImages: true,
    },
  });
};

export const getProductById = (id: number) => {
  return prisma.product.findUnique({
    where: { productId: id },
  });
};

export const getProductStock = async (id: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId: id },
    select: { stock: true },
  });

  return inventory?.stock ?? 0;
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

export const deleteProductById = async (id: number) => {
  const images = await prisma.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });

  await Promise.all(images.map(({ url }) => deleteFileByPath(url)));

  return prisma.$transaction(async (transaction) => {
    await transaction.productImage.deleteMany({
      where: { productId: id },
    });

    return transaction.product.delete({
      where: { productId: id },
    });
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
