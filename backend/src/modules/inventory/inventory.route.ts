import { Router } from "express";
import * as inventoryController from "./inventory.controller.ts";

const inventoryRouter = Router();

inventoryRouter.get("/:productId", inventoryController.getCurrentStock);
inventoryRouter.post("/", inventoryController.createStock);
inventoryRouter.patch("/:productId", inventoryController.updateStock);

export default inventoryRouter;
