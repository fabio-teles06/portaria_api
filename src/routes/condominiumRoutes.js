const express = require("express");
const CondominiumController = require("../controllers/condominiumController");
const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

const router = express.Router();

router.post("/create", [authMiddleware], CondominiumController.registerCondominium);
router.get("/my-condominiums", [authMiddleware, ownerMiddleware], CondominiumController.getCondominiumsByOwner);


module.exports = router;
