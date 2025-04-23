const express = require("express");
const router = express.Router();
const { getUserMock } = require("../controllers/user.controller");

router.get("/", getUserMock);

module.exports = router;
