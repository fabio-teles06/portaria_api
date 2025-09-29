import { Request, Response } from "express";
import UserModel from "../models/userModel";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ROLE } from "@prisma/client";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const createUserSchema = z.object({
  email: z.email(),
  condominiumId: z.number(),
  personId: z.number(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

function generateToken(payload: {
  user: { id: number; email: string; role: ROLE; condominiumId?: number };
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

const AuthController = {
  async login(req: Request, res: Response) {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }

    const { email, password } = parseResult.data;

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

      const token = generateToken({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          condominiumId: user.condominiumId,
        },
      });

      return res.status(200).json({ result: true, token });
    } catch (error) {
      console.error("login error:", error);
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
  async createOwner(req: Request, res: Response) {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }
    const { email, condominiumId, personId } = parseResult.data;

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ result: false, message: "Email already in use" });
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        role: ROLE.OWNER,
        condominiumId,
        personId,
      });
      return res.status(201).json({
        result: true,
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        tempPassword,
      });
    } catch (error) {
      console.error("createOwner error:", error);
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
  async createManager(req: Request, res: Response) {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }
    const { email, condominiumId, personId } = parseResult.data;

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ result: false, message: "Email already in use" });
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
        role: ROLE.MANAGER,
        condominiumId,
        personId,
      });
      return res.status(201).json({
        result: true,
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        tempPassword,
      });
    } catch (error) {
      console.error("createOwner error:", error);
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
  async changePassword(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ result: false, message: "Unauthorized" });
    }
    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        result: false,
        message: "Invalid input",
        errors: parseResult.error.issues,
      });
    }
    const { oldPassword, newPassword } = parseResult.data;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ result: false, message: "User not found" });
      }
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return res
          .status(400)
          .json({ result: false, message: "Old password is incorrect" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(userId, hashedNewPassword);
      return res
        .status(200)
        .json({ result: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("changePassword error:", error);
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
};

export default AuthController;
