// const express = require("express");
// const router = express.Router();
// const stateMasterController = require("../controllers/stateMasterController");

// router.post("/save", stateMasterController.saveState);

// module.exports = router;


const express = require("express");
const router = express.Router();
const stateMasterController = require("../controllers/stateMasterController");

router.post("/save", stateMasterController.saveState);

/* ✅ ADD THIS */
router.get("/list", stateMasterController.listStates);

/* (optional but recommended) */
router.delete("/delete/:StateId", stateMasterController.deleteState);

router.put("/update/:StateId", stateMasterController.updateState);

module.exports = router;
