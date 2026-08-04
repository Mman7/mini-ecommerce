import type { Request, Response } from "express";
import {
  deleteUserData,
  getTotalUsers,
  getUserData,
  updateUserData,
} from "./user.service.ts";

// RUD ---------------------------------------------------------------------------------
export const handleMe = async (req: Request, res: Response) => {
  // check user cookies and return authorized user info
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { sub } = req.user;
  const user = await getUserData(sub);

  return res
    .status(200)
    .json({ message: "User info retrieved successfully!", user });
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const updatePayload = req.body;
  await updateUserData(req.user.sub, updatePayload);

  return res.status(200).json({ message: "User updated successfully!" });
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  await deleteUserData(req.user.sub);

  return res.status(200).json({ message: "User deleted successfully!" });
};

// --------------------------------------------------------------------------------------

// admin only
export const getAllUsers = async (req: Request, res: Response) => {
  const totalUser = await getTotalUsers();

  return res
    .status(200)
    .json({ message: "Total users retrieved successfully!", totalUser });
};
