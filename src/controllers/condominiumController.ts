import CondominiumModel from "../models/condominiumModel";
import { Request, Response } from "express";
import z from "zod";

const createCondominiumSchema = z.object({
  name: z.string().min(1, "Name of condominium is required"),
  address: z.string().min(1, "Address is required"),
  cnpj: z.string().min(1, "CNPJ is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

const CondominiumController = {
  create: async (req: Request, res: Response) => {
    try {
      const parsedData = createCondominiumSchema.parse(req.body);
      const condominium = await CondominiumModel.create(parsedData);
      res.status(201).json(condominium);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default CondominiumController;