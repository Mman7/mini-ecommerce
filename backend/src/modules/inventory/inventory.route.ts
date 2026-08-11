import { Router } from "express";
import * as inventoryController from "./inventory.controller.ts";

const inventoryRouter = Router();

inventoryRouter.get("/:productId", inventoryController.getCurrentStock);

export default inventoryRouter;
