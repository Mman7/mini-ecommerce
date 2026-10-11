import multer from "multer";
import type { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";
import type { NextFunction, Response } from "express";
import { fileTypeFromFile } from "file-type";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const imageExtensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// create the uploads directory if it doesn't exist
const uploadDir =
  process.env.UPLOAD_DIR || path.resolve(process.cwd(), "..", "uploads");

console.log("Upload directory:", uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,

  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext =
      imageExtensions[file.mimetype] ?? path.extname(file.originalname);
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

export const validateUploadedImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = [
    ...(req.file ? [req.file] : []),
    ...Object.values(req.files ?? {}).flat(),
  ];

  try {
    for (const file of files) {
      const detected = await fileTypeFromFile(file.path);
      if (!detected || !allowedMimeTypes.includes(detected.mime)) {
        await Promise.all(
          files.map((uploaded) =>
            fs.promises.unlink(uploaded.path).catch(() => undefined),
          ),
        );
        return res
          .status(400)
          .json({
            message: "Uploaded file is not a valid JPEG, PNG, or WebP image",
          });
      }
    }
    next();
  } catch (error) {
    await Promise.all(
      files.map((uploaded) =>
        fs.promises.unlink(uploaded.path).catch(() => undefined),
      ),
    );
    next(error);
  }
};
