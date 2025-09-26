import { Request, Response } from "express";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import PersonModel from "../models/personModel";
import UserModel from "../models/userModel";
import { ROLE } from "@prisma/client";
import { error } from "console";

const createPersonSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11).max(14),
  phone: z.string().min(10).max(15),
});

const findPersonSchema = z.object({
  cpf: z.string().min(11).max(14),
});

const PersonController = {
  //Para cadastro de pessoas
  async create(req: Request, res: Response) {
    try {
      const { name, cpf, phone } = createPersonSchema.parse(req.body);
      const person = await PersonModel.create({ name, cpf, phone });
      res.status(201).json({ result: true, person });
    } catch (error) {
      res
        .status(500)
        .json({ result: false, message: "Internal server error", error });
    }
  },
  async find(req: Request, res: Response) {
    try {
      const { cpf } = findPersonSchema.parse(req.body);
      const person = await PersonModel.findByCpf(cpf);
      if (!person)
        res
          .status(404)
          .json({ result: false, message: "Person not found", error });

      res.status(200).json(person);
    } catch (error) {
      res
        .status(500)
        .json({ result: false, message: "Internal server error", error });
    }
  },
};

export default PersonController;
