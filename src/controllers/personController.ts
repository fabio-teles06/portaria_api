import { Request, Response } from "express";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import PersonModel from "../models/personModel";
import UserModel from "../models/userModel";
import { ROLE } from "@prisma/client";

const PersonController = {
  //Para cadastro de pessoas
  async create(req: Request, res: Response) {
    const tenantId = req.tenantId;

    const createPersonSchema = z.object({
      name: z.string().min(1),
      cpf: z.string().min(11).max(14),
      phone: z.string().min(10).max(15),
    });

    try {
      if (!tenantId) {
        return res.status(400).json({ error: "Tenant ID is required" });
      }
      const { name, cpf, phone } = createPersonSchema.parse(req.body);
      const newPerson = await PersonModel.create({
        name,
        cpf,
        phone,
        tenantId,
      });
      res.status(201).json({ result: true, person: newPerson });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ result: false, errors: error.issues });
      }
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  },
  async addUser(req: Request, res: Response) {
    const tenantId = req.tenantId;
    const personId = req.params.id;
    const { email } = req.body;

    if (!tenantId) {
      return res
        .status(400)
        .json({ result: false, error: "Tenant ID is required" });
    }

    try {
      const person = await PersonModel.findById(Number(personId));
      if (!person) {
        return res
          .status(404)
          .json({ result: false, error: "Person not found" });
      }

      const randomNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const hashedPassword = await bcrypt.hash(randomNumber, 10);

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ result: false, error: "Email already in use" });
      }

      const user = await UserModel.create({
        email,
        password: hashedPassword,
        role: ROLE.RESIDENT,
        personId: person.id,
        tenantId,
        firstAccess: true,
      });

      res.status(200).json({ result: true, user });
    } catch (error) {
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  },
  async getUser(req: Request, res: Response) {
    const personId = req.params.id;
    try {
      const user = await UserModel.findByPersonId(Number(personId));
      if (!user) {
        return res.status(404).json({ result: false, error: "User not found" });
      }
      res.status(200).json({ result: true, user });
    } catch (error) {
      res.status(500).json({ result: false, error: "Internal server error" });
    }
  },
};

export default PersonController;
