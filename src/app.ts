import express from "express";
import AuthRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());

app.use("/auth", AuthRoutes);

export default app;