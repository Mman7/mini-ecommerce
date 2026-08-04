import { prisma } from "../utils/prisma.ts";

export const getUserData = async (accessTokenSub: string) => {
  // get data from database using prisma
  const user = await prisma.user.findUnique({
    where: { userId: accessTokenSub },
    select: {
      userId: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  return user;
};

export const updateUserData = async (
  accessTokenSub: string,
  updatePayload: Record<string, unknown>,
) => {
  const user = await prisma.user.update({
    where: { userId: accessTokenSub },
    data: updatePayload,
  });
  return user;
};

export const deleteUserData = async (accessTokenSub: string) => {
  const user = await prisma.user.delete({
    where: { userId: accessTokenSub },
  });
  return user;
};

export const getTotalUsers = async () => {
  const totalUsers = await prisma.user.count();
  return totalUsers;
};
