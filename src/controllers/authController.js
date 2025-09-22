import TenantModel from "../models/tenantModel";
import UserModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AuthController = {
  async createAccount(req, res) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await UserModel.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      TenantModel.create({
        data: {
          users: {
            create: {
              username,
              email,
              password: await bcrypt.hash(password, 10),
              role: "ADMIN",
            },
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = AuthController;
