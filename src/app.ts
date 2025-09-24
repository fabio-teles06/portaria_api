import express from "express";
import AuthRoutes from "./routes/authRoutes";
import PersonRoutes from "./routes/personRoutes";

const app = express();
app.use(express.json());

app.use("/auth", AuthRoutes);
app.use("/person", PersonRoutes);

export default app;