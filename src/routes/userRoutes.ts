import { Router } from "express";
import AuthController from "../controllers/userController";
import UserMiddleware from "../middlewares/userMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import { ROLE } from "@prisma/client";
const AuthRoutes = Router();

AuthRoutes.post("/login", AuthController.login);
AuthRoutes.post(
  "/owner",
  [UserMiddleware, roleMiddleware([ROLE.ADMIN])],
  AuthController.createOwner
);

export default AuthRoutes;
