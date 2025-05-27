const express = require("express");
const router = express.Router();
const memeController = require("../controllers/meme.controller");

router.get("/GetMemes", memeController.getMemes);
router.get("/GetMeme/:id", memeController.getMemeById);

module.exports = router;
