import type { NextFunction, Request, Response } from "express";

export const validateFileId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileId = Number(req.params.fileId);
  if (!Number.isInteger(fileId) || fileId < 1) {
    return res.status(400).json({ message: "Invalid file ID" });
  }
  next();
};
