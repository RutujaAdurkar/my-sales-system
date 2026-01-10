// const express = require("express");
// const router = express.Router();
// const cityMasterController = require("../controllers/cityMasterController");

// router.post("/save", cityMasterController.saveCity);

// module.exports = router;


const express = require("express");
const router = express.Router();
const cityMasterController = require("../controllers/cityMasterController");

/* SAVE */
router.post("/save", cityMasterController.saveCity);

/* LIST */
router.get("/list", cityMasterController.listCities);

/* DELETE */
router.delete("/delete/:cityId", cityMasterController.deleteCity);

router.put("/update/:cityId", cityMasterController.updateCity);

module.exports = router;
