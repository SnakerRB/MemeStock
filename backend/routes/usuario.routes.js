const express = require("express");
const router = express.Router();
const { createOrFindUser  } = require("../controllers/usuario.controller");

router.post("/newuser", createOrFindUser );

module.exports = router;
