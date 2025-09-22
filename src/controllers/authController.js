const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const OwnerModel = require("../models/ownerModel");
const ResidentModel = require("../models/residentModel");

const AuthController = {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const owner = await OwnerModel.findByUser(user.id);
      const resident = await ResidentModel.findByUser(user.id);

      const token = jwt.sign(
        { user, owner, resident },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token, sindico: owner, morador: resident });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      newUser.password = undefined;

      res.status(201).json({ message: "User registered", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  async createAccount(req, res) {
    const { username, email, password, role } = req.body;
  },
};

module.exports = AuthController;
