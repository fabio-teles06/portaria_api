import express from "express";
import AuthRoutes from "./routes/userRoutes";
import PersonRoutes from "./routes/personRoutes";
import CondominiumRoutes from "./routes/condominiumRoutes";

const app = express();
app.use(express.json());

app.use("/user", AuthRoutes);
app.use("/person", PersonRoutes);
app.use("/condominium", CondominiumRoutes);

export default app;