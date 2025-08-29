const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const AuthController = {
  async register(req, res) {
    const { username, password } = req.body;

    try {
      const existing = await UserModel.findByUsername(username);
      if (existing) return res.status(400).json({ message: "Usuário já existe" });

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create(username, hashedPassword);

      res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno" });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await UserModel.findByUsername(username);
      if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Senha inválida" });

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

      res.json({ id: user.id, username: user.username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno" });
    }
  },
};

module.exports = AuthController;
