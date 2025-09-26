import { Router } from "express";
import AuthController from "../controllers/authController";
const AuthRoutes = Router();

AuthRoutes.post("/login", AuthController.login);

export default AuthRoutes;