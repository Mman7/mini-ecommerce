import { prisma } from "../../utils/prisma.ts";

type PageQuery = { page: number; limit: number };

const serializeDate = (value: Date) => value.toISOString();

export const createCategory = async (name: string) => {
  const category = await prisma.category.create({
    data: {
      name,
    },
  });
  return category;
};

export const getCategoryById = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: {
      categoryId: categoryId,
    },
    select: { categoryId: true, name: true, products: true },
  });
  return category;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    select: { categoryId: true, name: true },
  });
  return categories;
};

export const getCategoryProducts = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: {
      categoryId: categoryId,
    },
    select: { products: true },
  });
  return category;
};

export const getCategoryProductById = async (
  categoryId: number,
  productId: number,
) => {
  const category = await prisma.category.findUnique({
    where: {
      categoryId: categoryId,
    },
    select: {
      products: {
        where: {
          productId: productId,
        },
      },
    },
  });
  return category;
};

export const updateCategory = async (categoryId: number, data: object) => {
  const category = await prisma.category.update({
    where: {
      categoryId: categoryId,
    },
    data: data,
  });
  return category;
};

export const deleteCategory = async (categoryId: number) => {
  const category = await prisma.category.delete({
    where: {
      categoryId: categoryId,
    },
  });
  return category;
};

export const deleteCategoryProducts = async (
  categoryId: number,
  productId: number,
) => {
  const category = await prisma.category.update({
    where: {
      categoryId: categoryId,
    },
    data: {
      products: {
        deleteMany: {
          productId: productId,
        },
      },
    },
  });
  return category;
};

export const addProductToCategory = async (
  categoryId: number,
  productId: number,
) => {
  const category = await prisma.category.update({
    where: {
      categoryId: categoryId,
    },
    data: {
      products: {
        connect: {
          productId: productId,
        },
      },
    },
    select: {
      categoryId: true,
      name: true,
      products: {
        select: {
          productId: true,
          name: true,
          categoryId: true,
        },
      },
    },
  });
  return category;
};

export const activeCategory = async (categoryId: number) => {
  const category = await prisma.category.update({
    where: {
      categoryId: categoryId,
    },
    data: {
      isActive: true,
    },
  });
  return category;
};

export const deactivateCategory = async (categoryId: number) => {
  const category = await prisma.category.update({
    where: {
      categoryId: categoryId,
    },
    data: {
      isActive: false,
    },
  });
  return category;
};

export const getCategoriesForAdmin = async ({
  page,
  limit,
  search,
  status,
  sortBy,
  sortOrder,
}: PageQuery & {
  search?: string | undefined;
  status?: "active" | "inactive" | undefined;
  sortBy?: "name" | "createdAt" | "updatedAt" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}) => {
  const where = {
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(status !== undefined ? { isActive: status === "active" } : {}),
  };
  const [items, total, activeCount, allCount] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { [sortBy ?? "createdAt"]: sortOrder ?? "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.category.count({ where }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.category.count(),
  ]);
  return {
    items: items.map(({ _count, ...category }) => ({
      ...category,
      createdAt: serializeDate(category.createdAt),
      updatedAt: serializeDate(category.updatedAt),
      productCount: _count.products,
    })),
    statistics: { all: allCount, active: activeCount },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getCategoryForAdmin = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: { categoryId },
    include: {
      products: {
        include: {
          productImages: { where: { isThumbnail: true }, take: 1 },
          inventory: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });
  if (!category) return null;
  return {
    ...category,
    createdAt: serializeDate(category.createdAt),
    updatedAt: serializeDate(category.updatedAt),
    products: category.products.map((product) => ({
      ...product,
      price: Number(product.price),
      createdAt: serializeDate(product.createdAt),
      updatedAt: serializeDate(product.updatedAt),
      stock: product.inventory?.stock ?? 0,
    })),
  };
};
