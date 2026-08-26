import type { Request, Response } from "express";
import * as userService from "./user.service.ts";
import type { UserUpdateInput } from "../../generated/prisma/models.ts";

// RUD ---------------------------------------------------------------------------------
export const handleMe = async (req: Request, res: Response) => {
  // check user cookies and return authorized user info
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { userId } = req.user;
    const user = await userService.getUserData(userId);

    return res
      .status(200)
      .json({ message: "User info retrieved successfully!", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { name, email, deliveryAddress, phoneNumber }: UserUpdateInput =
    req.body;

  if (!name && !email && !deliveryAddress && !phoneNumber) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update" });
  }
  const updateData: UserUpdateInput = {};
  // include only the fields that are provided in the request body
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (deliveryAddress !== undefined)
    updateData.deliveryAddress = deliveryAddress;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update" });
  }

  try {
    // why do we need to call getUserData after updateUserData?
    // Because updateUserData does not return the updated user data, it only performs the update operation.
    // To get the latest user data after the update, we need to call getUserData again.
    // This ensures that we return the most current user information in the response.
    await userService.updateUserData(req.user.userId, updateData);
    const user = await userService.getUserData(req.user.userId);

    return res
      .status(200)
      .json({ message: "User updated successfully!", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  // check if the user is trying to delete their own account
  if (req.user.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only delete your own account." });
  }
  await userService.deleteUserData(req.user.userId);

  return res.status(200).json({ message: "User deleted successfully!" });
};

export const handleGetAddresses = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const addresses = await userService.getAddresses(req.user.userId);
  return res.status(200).json({ addresses });
};

export const handleCreateAddress = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { address } = req.body as { address?: string };
  if (!address?.trim()) {
    return res.status(400).json({ message: "Address is required" });
  }

  const addresses = await userService.createAddress(req.user.userId, {
    address: address.trim(),
  });
  return res.status(201).json({ addresses });
};

export const handleUpdateAddress = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const addressId = Number(req.params.addressId);
  const { address } = req.body as { address?: string };
  if (!Number.isInteger(addressId) || addressId < 1) {
    return res.status(400).json({ message: "Invalid address ID" });
  }
  if (!address?.trim()) {
    return res.status(400).json({ message: "Address is required" });
  }

  const addresses = await userService.updateAddress(
    req.user.userId,
    addressId,
    { address: address.trim() },
  );
  if (!addresses) return res.status(404).json({ message: "Address not found" });
  return res.status(200).json({ addresses });
};

export const handleDeleteAddress = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const addressId = Number(req.params.addressId);
  if (!Number.isInteger(addressId) || addressId < 1) {
    return res.status(400).json({ message: "Invalid address ID" });
  }
  const addresses = await userService.deleteAddress(req.user.userId, addressId);
  if (!addresses) return res.status(404).json({ message: "Address not found" });
  return res.status(200).json({ addresses });
};

// --------------------------------------------------------------------------------------

// admin only
export const getAllUsers = async (req: Request, res: Response) => {
  const totalUser = await userService.getTotalUsers();

  return res
    .status(200)
    .json({ message: "Total users retrieved successfully!", totalUser });
};

export const activeUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid or missing User ID." });
    }
    const user = await userService.activeUser(id);

    return res
      .status(200)
      .json({ message: "User activated successfully!", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const inactiveUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid or missing User ID." });
    }
    const user = await userService.inactiveUser(id);

    return res
      .status(200)
      .json({ message: "User deactivated successfully!", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
