import type { Request, Response } from "express";

export const handleMe = async (req: Request, res: Response) => {
  // check user cookies and return authorized user info
  const { user } = req.cookies ?? {};
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  return res
    .status(200)
    .json({ message: "User info retrieved successfully!", user });
};
