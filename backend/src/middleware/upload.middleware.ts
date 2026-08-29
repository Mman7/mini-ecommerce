import multer from "multer";
import type { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// create the uploads directory if it doesn't exist
const uploadDir =
  process.env.UPLOAD_DIR || path.resolve(process.cwd(), "..", "uploads");

console.log("Upload directory:", uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,

  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
