import { Request, Response } from "express";
import UserModel from "../models/userModel";
import ResidentModel from "../models/residentModel";
import { z } from "zod";
import { ROLE } from "@prisma/client";

const createResidentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cpf: z.string().min(11, "CPF must be at least 11 characters"),
  apartmentId: z.number().min(1, "Apartment number is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const ResidentController = {
  async createResident(req: Request, res: Response) {
    try {
      const condominiumId = req.condominiumId!;
      const parsedData = createResidentSchema.parse(req.body);
      const { name, cpf, apartmentId, username, password } = parsedData;
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingResident = await ResidentModel.findByCpf(cpf, condominiumId);
      if (existingResident) {
        return res.status(400).json({ message: "CPF already registered" });
      }

      const newUser = await UserModel.create({
        username,
        password,
        role: ROLE.RESIDENT,
        condominiumId: condominiumId,
      });

      const newResident = await ResidentModel.create({
        name,
        cpf,
        apartmentId: apartmentId,
        userId: newUser.id,
        condominiumId: condominiumId,
      });
      
      return res.status(201).json(newResident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getResidentById(req: Request, res: Response) {
    try {
      const residentId = parseInt(req.params.id, 10);
      const condominiumId = req.condominiumId!;
      const resident = await ResidentModel.findById(residentId, condominiumId);
      if (!resident) {
        return res.status(404).json({ message: "Resident not found" });
      }
      return res.status(200).json(resident);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getAllResidents(req: Request, res: Response) {
    try {
      const condominiumId = req.condominiumId!;
      const residents = await ResidentModel.findAll(condominiumId);
      return res.status(200).json(residents);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default ResidentController;
