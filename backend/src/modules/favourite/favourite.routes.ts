import { Router } from "express";
import * as favouriteController from "./favourite.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { validateFavouriteProductId } from "./favourite.validator.ts";

const favouriteRoutes = Router();

favouriteRoutes.get("/", authMiddleware, favouriteController.getUserFavourites);
favouriteRoutes.post(
  "/",
  authMiddleware,
  validateFavouriteProductId,
  favouriteController.addUserFavourite,
);
favouriteRoutes.delete(
  "/:productId",
  authMiddleware,
  validateFavouriteProductId,
  favouriteController.removeUserFavourite,
);

export default favouriteRoutes;
