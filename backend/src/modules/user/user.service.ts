import { prisma } from "../../utils/prisma.ts";
import type { UserUpdateInput } from "../../generated/prisma/models.ts";
import type {
  AuthUserData,
  SavedAddress,
} from "../../interfaces/user.interface.ts";

export const getTotalUsers = async () => {
  const totalUsers = await prisma.user.count();
  return totalUsers;
};

export const getUserData = async (accessTokenSub: string) => {
  // get data from database using prisma
  const user = await prisma.user.findUnique({
    where: { userId: accessTokenSub },
    select: {
      userId: true,
      name: true,
      email: true,
      deliveryAddress: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  if (!user) return null;

  return user as AuthUserData;
};

export const updateUserData = async (
  accessTokenSub: string,
  updatePayload: UserUpdateInput,
) => {
  const { deliveryAddress: _deliveryAddress, ...userData } = updatePayload;
  const user = await prisma.user.update({
    where: { userId: accessTokenSub },
    data: userData,
  });
  return user;
};

export const getAddresses = async (userId: string) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createAddress = async (
  userId: string,
  address: Pick<SavedAddress, "address">,
) => {
  if (!address.address.trim()) throw new Error("Address is required");
  await prisma.userAddress.create({
    data: { userId, address: address.address.trim() },
  });
  return getAddresses(userId);
};

export const updateAddress = async (
  userId: string,
  addressId: number,
  updates: Pick<SavedAddress, "address">,
) => {
  if (!updates.address?.trim()) throw new Error("Address is required");
  const existingAddress = await prisma.userAddress.findFirst({
    where: { id: addressId, userId },
  });

  if (!existingAddress) return null;

  await prisma.userAddress.update({
    where: { id: existingAddress.id },
    data: { address: updates.address.trim() },
  });

  return getAddresses(userId);
};

export const deleteAddress = async (userId: string, addressId: number) => {
  const result = await prisma.userAddress.deleteMany({
    where: { id: addressId, userId },
  });
  if (result.count === 0) return null;
  return getAddresses(userId);
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
