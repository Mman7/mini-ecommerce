import { Router } from "express";
import * as inventoryController from "./inventory.controller.ts";
import { validateProductId } from "./inventory.validator.ts";

const inventoryRouter = Router();

inventoryRouter.get(
  "/:productId",
  validateProductId,
  inventoryController.getCurrentStock,
);

export default inventoryRouter;
