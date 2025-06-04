const express = require("express");
const router = express.Router();
const operacionesController = require("../controllers/operaciones.controller");

router.post("/", operacionesController.registrarOperacion);
//Ranking
router.get("/ranking", operacionesController.rankingInversores);
router.get("/:userId", operacionesController.listarOperaciones);

module.exports = router;
