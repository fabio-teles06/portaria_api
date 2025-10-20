import { Router } from "express";
import AuthController from "../controllers/userController";
import UserMiddleware from "../middlewares/userMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import { ROLE } from "@prisma/client";
const AuthRoutes = Router();

AuthRoutes.post("/login", AuthController.login);

export default AuthRoutes;
