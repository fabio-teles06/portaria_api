import { Request, Response } from "express";
import prisma from "../lib/prisma";

async function createCondominium(req: Request, res: Response) {
  const {
    name,
    address,
  }: {
    name: string;
    address: string;
  } = req.body;

  try {
    const condominium = await prisma.condominium.create({
      data: {
        name,
        address,
      },
    });
    res.status(201).json(condominium);
  } catch (error) {
    res.status(500).json({ error: "Failed to create condominium" });
  }
}

async function getCondominiums(req: Request, res: Response) {
  try {
    const condominiums = await prisma.condominium.findMany();
    res.status(200).json(condominiums);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch condominiums" });
  }
}

export { createCondominium, getCondominiums };