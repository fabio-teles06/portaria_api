import { Request, Response } from "express";
import { error } from "console";
import { z } from "zod";
import ResidentModel from "../models/residentModel";

const createResidentSchema = z.object({
  personId: z.number().int(),
  apartment: z.string().min(1),
  block: z.string().min(1),
});

const ResidentController = {
  create: async (req: Request, res: Response) => {
    const tenantId = req.tenantId!;
    const { personId, apartment, block } = createResidentSchema.parse(req.body);

    try {
      const newResident = await ResidentModel.create({
        personId,
        tenantId,
        apartment,
        block,
      });
      res.status(201).json(newResident);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ResidentController;
