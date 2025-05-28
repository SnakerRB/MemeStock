const express = require("express");
const router = express.Router();
const { createOrFindUser, getUserData   } = require("../controllers/usuario.controller");

router.post("/newuser", createOrFindUser );
router.get("/:userId", getUserData)

module.exports = router;
