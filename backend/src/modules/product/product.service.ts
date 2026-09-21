import { prisma } from "../../utils/prisma.ts";
import { deleteFileByPath } from "../file/file.service.ts";
import slugify from "slugify";
import type {
  Product,
  ProductResponse,
  ProductSearchQuery,
} from "../../types/product.js";
import type { ProductUpdateInput } from "../../generated/prisma/models.ts";

const createSlug = (name: string) =>
  slugify(name, { lower: true, strict: true, trim: true }) || "product";

const getUniqueSlug = async (name: string) => {
  const baseSlug = createSlug(name);
  const matches = await prisma.product.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });
  const usedSlugs = new Set(matches.map(({ slug }) => slug));
  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) suffix += 1;
  return `${baseSlug}-${suffix}`;
};

export const getTotalProducts = async () => {
  const totalProducts = await prisma.product.count();
  return totalProducts;
};

export const createProduct = async ({
  name,
  slug: requestedSlug,
  description,
  price,
  productImages,
  categoryId,
  stock = 0,
  reorderAt,
}: Product & {
  categoryId?: number;
  stock?: number;
  reorderAt?: number;
}) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = await getUniqueSlug(requestedSlug ?? name);
    try {
      return await prisma.product.create({
        data: {
          name,
          slug,
          description,
          price,
          ...(categoryId !== undefined ? { categoryId } : {}),
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
          inventory: {
            create: { stock, reorderAt: reorderAt ?? null },
          },
        },
        include: { productImages: true },
      });
    } catch (error) {
      if ((error as { code?: string }).code !== "P2002") throw error;
    }
  }
  throw new Error("Unable to create a unique product slug");
};

const productInclude = {
  productImages: { orderBy: { sortOrder: "asc" as const } },
  category: { select: { categoryId: true, name: true } },
  inventory: { select: { stock: true, reorderAt: true } },
};

type ProductWithRelations = {
  slug: string;
  productId: number;
  name: string;
  sku: string | null;
  description: string;
  price: { toString(): string } | number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  productImages: Array<{
    id: number;
    productId: number;
    url: string;
    altText: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    isThumbnail: boolean;
  }>;
  category: { categoryId: number; name: string } | null;
  inventory: { stock: number; reorderAt: number | null } | null;
};

export const serializeProduct = (
  product: ProductWithRelations,
): ProductResponse => ({
  productId: product.productId,
  name: product.name,
  slug: product.slug,
  sku: product.sku,
  description: product.description,
  price: Number(product.price),
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
  isActive: product.isActive,
  productImages: product.productImages.map((image) => ({
    ...image,
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString(),
  })),
  category: product.category,
  stock: product.inventory?.stock ?? 0,
});

export const getProductById = (id: number) => {
  return prisma.product.findUnique({
    where: { productId: id },
    include: productInclude,
  });
};

export const getProductBySlug = (slug: string) =>
  prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });

export const getProductStock = async (id: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId: id },
    select: { stock: true },
  });

  return inventory?.stock ?? 0;
};

export const getProducts = async ({
  page,
  limit,
  maxPrice,
  minPrice,
  name,
  categoryId,
  inStock,
  sortBy = "productId",
  sortOrder = "asc",
}: ProductSearchQuery) => {
  const where = {
    isActive: true,
    name: { contains: name, mode: "insensitive" as const },
    price: { gte: minPrice ?? 0, lte: maxPrice ?? Number.MAX_VALUE },
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(inStock === true ? { inventory: { stock: { gt: 0 } } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: productInclude,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(serializeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export type AdminProductQuery = {
  page: number;
  limit: number;
  search?: string | undefined;
  categoryId?: number | undefined;
  status?: "active" | "inactive" | undefined;
  stock?: "in" | "low" | "out" | undefined;
  sortBy?: "name" | "price" | "stock" | "createdAt" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
};

export const getProductsForAdmin = async ({
  page,
  limit,
  search,
  categoryId,
  status,
  stock,
  sortBy,
  sortOrder,
}: AdminProductQuery) => {
  let inventoryFilter:
    | { stock: { equals: number } }
    | { stock: { gt: number } }
    | { stock: { gt: number; lte: number } }
    | undefined;

  if (stock === "out") {
    inventoryFilter = { stock: { equals: 0 } };
  } else if (stock === "in") {
    inventoryFilter = { stock: { gt: 0 } };
  } else if (stock === "low") {
    inventoryFilter = { stock: { gt: 0, lte: 10 } };
  }

  const where = {
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(status !== undefined ? { isActive: status === "active" } : {}),
    ...(inventoryFilter !== undefined ? { inventory: inventoryFilter } : {}),
  };
  const orderBy =
    sortBy === "stock"
      ? { inventory: { stock: sortOrder ?? "desc" } }
      : { [sortBy ?? "createdAt"]: sortOrder ?? "desc" };
  const [items, total, all, active, outOfStock, lowStock] =
    await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          OR: [
            { inventory: { is: null } },
            { inventory: { stock: { equals: 0 } } },
          ],
        },
      }),
      prisma.product.count({
        where: { inventory: { stock: { gt: 0, lte: 10 } } },
      }),
    ]);
  return {
    items: items.map((product) => serializeProduct(product)),
    statistics: { all, active, outOfStock, lowStock },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getProductForAdmin = (productId: number) =>
  prisma.product
    .findUnique({ where: { productId }, include: productInclude })
    .then((product) => (product ? serializeProduct(product) : null));

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

  const updatedImage = await prisma.$transaction(async (transaction) => {
    if (data.isThumbnail === true) {
      await transaction.productImage.updateMany({
        where: { productId },
        data: { isThumbnail: false },
      });
    }
    return transaction.productImage.update({
      where: { id: imageId },
      data,
    });
  });

  if (data.url && data.url !== image.url) {
    await deleteFileByPath(image.url);
  }

  return updatedImage;
};

export const createProductImage = async (
  productId: number,
  data: {
    url: string;
    altText?: string;
    sortOrder?: number;
    isThumbnail?: boolean;
  },
) => {
  const product = await prisma.product.findUnique({
    where: { productId },
    select: { productId: true },
  });
  if (!product) throw new Error(`Product ${productId} not found`);

  return prisma.$transaction(async (transaction) => {
    if (data.isThumbnail === true) {
      await transaction.productImage.updateMany({
        where: { productId },
        data: { isThumbnail: false },
      });
    }
    const sortOrder =
      data.sortOrder ??
      ((
        await transaction.productImage.aggregate({
          where: { productId },
          _max: { sortOrder: true },
        })
      )._max.sortOrder ?? -1) + 1;
    return transaction.productImage.create({
      data: {
        productId,
        url: data.url,
        altText: data.altText ?? null,
        sortOrder,
        isThumbnail: data.isThumbnail ?? false,
      },
    });
  });
};

export const deleteProductImageById = async (
  productId: number,
  imageId: number,
) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });
  if (!image || image.productId !== productId) {
    throw new Error(
      `Product image with ID ${imageId} not found for product ${productId}`,
    );
  }
  await prisma.productImage.delete({ where: { id: imageId } });
  await deleteFileByPath(image.url);
  return image;
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
    include: productInclude,
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
      include: productInclude,
      orderBy: {
        productId: "asc",
      },
      take: limit - finalRecommendedProducts.length,
    });

    finalRecommendedProducts.push(...randomProducts);
  }
  return finalRecommendedProducts.map(serializeProduct);
};
