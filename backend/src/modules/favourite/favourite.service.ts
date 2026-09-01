import { prisma } from "../../utils/prisma.ts";

export const getUserFavourites = async (userId: string) => {
  return prisma.favourite.findMany({
    where: { userId },
    include: { product: { include: { productImages: true } } },
  });
};

export const addUserFavourite = async (userId: string, productId: number) => {
  return prisma.favourite.create({
    data: { userId, productId },
  });
};

export const removeUserFavourite = async (
  userId: string,
  productId: number,
) => {
  const result = await prisma.favourite.deleteMany({
    where: { userId, productId },
  });
  if (result.count === 0) return null;
  return result;
};
