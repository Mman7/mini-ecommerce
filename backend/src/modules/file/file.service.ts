import * as fs from "fs";
import path from "path";
import { prisma } from "../../utils/prisma.ts";

export const deleteFileByPath = async (filePath: string): Promise<void> => {
  const uploadDir =
    process.env.UPLOAD_DIR || path.resolve(process.cwd(), "..", "uploads");
  const resolvedFilePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(uploadDir, path.basename(filePath));

  try {
    await fs.promises.unlink(resolvedFilePath);
  } catch (error) {
    console.error(`Error deleting file at ${resolvedFilePath}:`, error);
    throw new Error(`Failed to delete file at ${resolvedFilePath}`);
  }
};

export const deleteFileById = async (fileId: number): Promise<void> => {
  const image = await prisma.productImage.findUnique({
    where: {
      id: fileId,
    },
    select: {
      url: true,
    },
  });

  if (!image) {
    throw new Error(`File with ID ${fileId} not found`);
  }

  const filename = path.basename(image.url);

  const uploadDir =
    process.env.UPLOAD_DIR || path.resolve(process.cwd(), "..", "uploads");
  const filePath = path.join(uploadDir, filename);
  await deleteFileByPath(filePath);
};
