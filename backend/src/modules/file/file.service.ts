import * as fs from "fs";
import path from "path";
import { prisma } from "../../utils/prisma.ts";

export const deleteFileByPath = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file at ${filePath}:`, error);
    throw new Error(`Failed to delete file at ${filePath}`);
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

  const filePath = path.join("/app/uploads", filename);
  await deleteFileByPath(filePath);
};
