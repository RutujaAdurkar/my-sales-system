const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/itemmaster", itemController.getItems);
router.post("/itemmaster", itemController.addItem);
router.put("/itemmaster/:id", itemController.updateItem);
router.delete("/itemmaster/:id", itemController.deleteItem);

module.exports = router;