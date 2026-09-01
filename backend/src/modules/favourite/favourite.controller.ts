import type { Request, Response } from "express";
import * as favouriteService from "./favourite.service.ts";

export const getUserFavourites = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const favourites = await favouriteService.getUserFavourites(req.user.userId);
  return res.status(200).json({ favourites });
};

export const addUserFavourite = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const productId = Number(req.body?.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const favourite = await favouriteService.addUserFavourite(
    req.user.userId,
    productId,
  );
  return res.status(201).json({ favourite });
};

export const removeUserFavourite = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const result = await favouriteService.removeUserFavourite(
    req.user.userId,
    productId,
  );
  if (!result) return res.status(404).json({ message: "Favourite not found" });
  return res.status(200).json({ message: "Favourite removed successfully" });
};
