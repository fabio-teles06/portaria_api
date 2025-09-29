import { Router } from "express";
import PersonController from "../controllers/personController";
import UserMiddleware from "../middlewares/userMiddleware";
import RoleMiddleware from "../middlewares/roleMiddleware";
import { ROLE } from "@prisma/client";

const PersonRoutes = Router();

PersonRoutes.use(UserMiddleware);

PersonRoutes.post(
  "/",
  RoleMiddleware([ROLE.ADMIN, ROLE.MANAGER]),
  PersonController.create
);
PersonRoutes.get("/",
  RoleMiddleware([ROLE.ADMIN, ROLE.MANAGER, ROLE.DOORMAN]),
  PersonController.find
);

export default PersonRoutes;
