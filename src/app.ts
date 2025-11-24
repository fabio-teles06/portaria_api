import express from "express";
import prisma from "./lib/prisma";
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  //Condominio de ID 0 é o condominio padr��o para administradores
  const condominium = await prisma.condominium.create({
    data: {
      id: 0,
      name: "Condominio Padrão",
      address: "Endereço Padrão",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Adiministrador",
      email: "admin@eportaria.com",
      password: "$2a$14$PXfsCT0bvUttDp2pHXVjD.WoziIq6KGtTiTryHiDDiXEWAg8TQLcO",
      role: "ADMIN",
      condominiumId: condominium.id,
    },
  });

  res.json({ condominium, user });
});

export default app;
