import type { Request, Response } from "express";

export const loginAccount = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Login successful!" });
};

export const logoutAccount = (req: Request, res: Response) => {
  // TODO implement logout
  return res.status(200).json({ message: "Logout successful!" });
};

export const registerAccount = (req: Request, res: Response) => {
  // TODO implement register
  return res.status(200).json({ message: "Register successful!" });
};
