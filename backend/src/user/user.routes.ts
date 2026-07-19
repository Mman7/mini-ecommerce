import { Router } from "express";
import { handleMe } from "./user.service.ts";

/* 
TODO: Implement the following features in the user controller:
User Profile
Update User
User CRUD
*/

const userRoute = Router();
userRoute.get("/me", handleMe);

// auth routes for login/logout to controller
// route to controller

export default userRoute;
