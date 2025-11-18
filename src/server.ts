import dotenv from "dotenv";
import app from "./app";
import AuthRoutes from "./routes/userRoutes";
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use("/auth", AuthRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor lançado na porta ${PORT}`);
});
