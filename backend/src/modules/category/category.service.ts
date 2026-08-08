import { prisma } from "../../utils/prisma.ts";

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
