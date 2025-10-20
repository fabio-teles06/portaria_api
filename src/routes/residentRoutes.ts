import { Router } from "express";
import ResidentController from "../controllers/residentController";
import UserMiddleware from "../middlewares/userMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import { ROLE } from "@prisma/client";
const ResidentRoutes = Router();

ResidentRoutes.post(
  "/create",
  [UserMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.OWNER, ROLE.MANAGER])],
  ResidentController.createResident
);
ResidentRoutes.get(
  "/:id",
  [UserMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.OWNER, ROLE.MANAGER, ROLE.DOORMAN])],
  ResidentController.getResidentById
);
ResidentRoutes.get(
  "/",
  [UserMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.OWNER, ROLE.MANAGER, ROLE.DOORMAN])],
  ResidentController.getAllResidents
);

export default ResidentRoutes;
