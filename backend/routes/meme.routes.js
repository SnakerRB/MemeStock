const express = require("express");
const router = express.Router();
const memeController = require("../controllers/meme.controller");

router.get("/GetMemes", memeController.getMemes);
router.get("/GetMeme/:id", memeController.getMemeById);
router.get("/GetMemesSummary", memeController.getMemesSummary);

module.exports = router;
