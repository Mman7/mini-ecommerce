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
    include: { productImages: true },
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

export const updateProductImageById = async (
  productId: number,
  imageId: number,
  data: {
    url?: string;
    altText?: string;
    sortOrder?: number;
    isThumbnail?: boolean;
  },
) => {
  // Validate ownership before updating and remove the old file when it is replaced.
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image || image.productId !== productId) {
    throw new Error(
      `Product image with ID ${imageId} not found for product ${productId}`,
    );
  }

  const updatedImage = await prisma.productImage.update({
    where: { id: imageId },
    data,
  });

  if (data.url && data.url !== image.url) {
    await deleteFileByPath(image.url);
  }

  return updatedImage;
};

export const deleteProductById = async (id: number) => {
  const images = await prisma.productImage.findMany({
    where: { productId: id },
    select: { url: true },
  });
  // guard if there are no images to delete
  if (images.length > 0) {
    await Promise.all(images.map(({ url }) => deleteFileByPath(url)));
  }

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

// get recommended item based on the most purchased items
export const getRecommendedProducts = async (limit: number) => {
  console.log("hello");
  const recommendedProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: {
      productId: { in: recommendedProducts.map(({ productId }) => productId) },
      isActive: true,
    },
    include: { productImages: true },
  });
  const productsById = new Map(
    products.map((product) => [product.productId, product]),
  );

  const finalRecommendedProducts = recommendedProducts
    .map(({ productId }) => productsById.get(productId))
    .filter((product) => product !== undefined);

  // Fill the remaining slots when there are not enough purchased products.
  if (finalRecommendedProducts.length < limit) {
    const randomProducts = await prisma.product.findMany({
      where: {
        productId: {
          notIn: finalRecommendedProducts.map(({ productId }) => productId),
        },
        isActive: true,
      },
      include: {
        productImages: {
          where: { isThumbnail: true },
        },
      },
      orderBy: {
        productId: "asc",
      },
      take: limit - finalRecommendedProducts.length,
    });

    finalRecommendedProducts.push(...randomProducts);
  }
  if (finalRecommendedProducts.length > 0) {
    console.log(
      "Recommended products:",
      finalRecommendedProducts[0]?.productImages,
    );
  }
  return finalRecommendedProducts;
};
