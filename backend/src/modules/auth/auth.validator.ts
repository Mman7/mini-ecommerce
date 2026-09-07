import type { NextFunction, Request, Response } from "express";

const requireCredentials = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body ?? {};
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

export const validateLogin = requireCredentials;

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body ?? {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      message: "Name, email and password are required",
    });
  }
  next();
};
