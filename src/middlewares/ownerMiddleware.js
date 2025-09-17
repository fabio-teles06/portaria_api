const jwt = require("jsonwebtoken");
const OwnerModel = require("../models/OwnerModel");

module.exports = (req, res, next) => {
  const { token, condominiumId } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  const user = jwt.decode(token, process.env.JWT_SECRET);
  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  OwnerModel.isOwner(user.id, condominiumId)
    .then((isOwner) => {
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    });
};
