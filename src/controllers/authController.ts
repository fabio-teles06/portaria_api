import { Request, Response } from "express";
import TenantModel from "../models/tenantModel";
import UserModel from "../models/userModel";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ROLE } from "@prisma/client";
import { z } from "zod";
import PersonModel from "../models/personModel";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const AuthController = {
  async createAccount(req: Request, res: Response) {
    const { name, cpf, phone, email, password, name_condominium, address } =
      req.body;

    //zod validation can be added heres\
    const createAccountSchema = z.object({
      name: z.string().min(1),
      cpf: z.string().min(11).max(14),
      phone: z.string().min(10).max(15),
      email: z.email(),
      password: z.string().min(6),
      name_condominium: z.string().min(1),
      address: z.string().min(1),
    });

    const parseResult = createAccountSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ result: false, message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const tenant = await TenantModel.create({
        name: name_condominium,
        address,
      });
      const person = await PersonModel.create({
        name,
        cpf,
        phone,
        tenantId: tenant.id,
      });
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        tenantId: tenant.id,
        role: ROLE.ADMIN,
        firstAccess: false,
        personId: person.id,
      });
      return res.status(201).json({ result: true, message: "Account created" });
    } catch (error) {
      return res
        .status(500)
        .json({ result: false, message: "Server error", error });
    }
  },
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    //zod validation can be added here
    const loginSchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res
          .status(400)
          .json({ result: false, message: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ result: false, message: "Invalid credentials" });
      }
      const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "24h" });
      return res.status(200).json({ result: true, token });
    } catch (error) {
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
};

export default AuthController;
