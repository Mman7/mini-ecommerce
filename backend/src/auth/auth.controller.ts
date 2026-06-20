import type { Request, Response } from "express";
/* 
TODO: Implement the following features in the auth controller:
Login
Register
Logout
Refresh Token
JWT
Password Hashing
*/

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

export const refreshToken = (req: Request, res: Response) => {
  // TODO implement refresh token
  return res.status(200).json({ message: "Token refreshed successfully!" });
};
