import { prisma } from "../../utils/prisma.ts";
import type { UserUpdateInput } from "../../generated/prisma/models.ts";

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
  updatePayload: UserUpdateInput,
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

export const activeUser = async (userId: string) => {
  // update user status to active in the database using prisma
  const user = await prisma.user.update({
    where: { userId },
    data: { isActive: true },
  });
  return user;
};

export const inactiveUser = async (userId: string) => {
  // update user status to inactive in the database using prisma
  const user = await prisma.user.update({
    where: { userId },
    data: { isActive: false },
  });
  return user;
};
