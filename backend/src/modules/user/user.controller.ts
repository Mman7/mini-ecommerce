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
    const updatedData = await userService.updateUserData(
      req.user.userId,
      updateData,
    );

    return res
      .status(200)
      .json({ message: "User updated successfully!", updatedData });
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
