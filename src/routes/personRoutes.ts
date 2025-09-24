import { Router } from "express";
import PersonController from "../controllers/personController";
import UserMiddleware from "../middlewares/userMiddleware";
import AdminMiddleware from "../middlewares/adminMiddleware";

const PersonRoutes = Router();

PersonRoutes.use(UserMiddleware);
PersonRoutes.use(AdminMiddleware);

PersonRoutes.post("/", PersonController.create);
PersonRoutes.post("/:id/user", PersonController.addUser);
PersonRoutes.get("/:id/user", PersonController.getUser);

export default PersonRoutes;
