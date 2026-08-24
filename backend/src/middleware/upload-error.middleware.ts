import multer from "multer";
import type { NextFunction, Request, Response } from "express";

export const handleSingleImageUploadError = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    error instanceof multer.MulterError &&
    error.code === "LIMIT_UNEXPECTED_FILE" &&
    error.field === "image"
  ) {
    return res.status(400).json({ message: "Only one image can be uploaded" });
  }

  next(error);
};