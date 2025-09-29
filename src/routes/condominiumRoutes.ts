import { Router } from "express";
import CondominiumController from "../controllers/condominiumController";
import UserMiddleware from "../middlewares/userMiddleware";
import RoleMiddleware from "../middlewares/roleMiddleware";
import { ROLE } from "@prisma/client";

const CondominiumRoutes = Router();

CondominiumRoutes.use(UserMiddleware);

CondominiumRoutes.post(
  "/",
  RoleMiddleware([ROLE.ADMIN]),
  CondominiumController.create
);



export default CondominiumRoutes;
