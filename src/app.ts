import express from "express";
import AuthRoutes from "./routes/userRoutes";
import ResidentRoutes from "./routes/residentRoutes";
import CondominiumRoutes from "./routes/condominiumRoutes";

const app = express();
app.use(express.json());

app.use("/user", AuthRoutes);
app.use("/resident", ResidentRoutes);
app.use("/condominium", CondominiumRoutes);

export default app;