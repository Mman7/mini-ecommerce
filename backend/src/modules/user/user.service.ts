import { prisma } from "../../utils/prisma.ts";
import type { UserUpdateInput } from "../../generated/prisma/models.ts";
import type { AuthUserData } from "../../interfaces/user.interface.ts";

export const getTotalUsers = async () => {
  const totalUsers = await prisma.user.count();
  return totalUsers;
};

export const getUserData = async (accessTokenSub: string) => {
  // get data from database using prisma
  const user: AuthUserData | null = await prisma.user.findUnique({
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

export const getTotalActiveUsers = async () => {
  const totalActiveUsers = await prisma.user.count({
    where: { isActive: true },
  });
  return totalActiveUsers;
};

export const getTotalInactiveUsers = async () => {
  const totalInactiveUsers = await prisma.user.count({
    where: { isActive: false },
  });
  return totalInactiveUsers;
};
