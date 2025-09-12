const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const AuthController = {
  async register(req, res) {
    const { email, username, password } = req.body;

    console.log(req.body);
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) return res.status(400).json({ message: "Usuário já existe" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create(username, email, hashedPassword);
      res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno" });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(400).json({ message: "Credenciais inválidas" });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: "Credenciais inválidas" });
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno" });
    }
  },
  async profile(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno" });
    }
  },

};

module.exports = AuthController;
