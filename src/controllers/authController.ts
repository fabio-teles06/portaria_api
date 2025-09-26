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

function generateToken(payload: {
  user: { id: number; email: string; role: ROLE; tenantId?: number };
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
          tenantId: user.tenantId,
        }
      });

      return res.status(200).json({ result: true, token });
    } catch (error) {
      console.error("login error:", error);
      return res.status(500).json({ result: false, message: "Server error" });
    }
  },
};

export default AuthController;
