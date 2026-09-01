import { Router } from "express";
import * as favouriteController from "./favourite.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const favouriteRoutes = Router();

favouriteRoutes.get("/", authMiddleware, favouriteController.getUserFavourites);
favouriteRoutes.post("/", authMiddleware, favouriteController.addUserFavourite);
favouriteRoutes.delete(
  "/:productId",
  authMiddleware,
  favouriteController.removeUserFavourite,
);

export default favouriteRoutes;
