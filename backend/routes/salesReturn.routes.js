const express = require("express");
const router = express.Router();
const controller = require("../controllers/salesReturn.controller");

/* SAVE */
router.post("/save", controller.saveSalesReturn);

module.exports = router;
