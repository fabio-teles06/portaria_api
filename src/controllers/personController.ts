import PersonModel from "../models/personModel";
import { Request, Response } from "express";
import z from "zod";

const createPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  contact: z.string().min(1, "Contact is required"),
  cpf: z.string().min(1, "CPF is required"),
});

const PersonController = {
  create: async (req: Request, res: Response) => {
    try {
      const parsedData = createPersonSchema.parse(req.body);
      const person = await PersonModel.create(parsedData);
      res.status(201).json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default PersonController;