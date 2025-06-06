const express = require("express");
const router = express.Router();
const { createOrFindUser, getUserData } = require("../controllers/usuario.controller");
const { obtenerMemesComprados, obtenerHistorialOperaciones }  = require("../controllers/operaciones.controller");

router.post("/newuser", createOrFindUser );
router.get("/:userId", getUserData)
router.get("/:userId/memes-comprados", obtenerMemesComprados);
router.get("/:userId/historial", obtenerHistorialOperaciones);


module.exports = router;
