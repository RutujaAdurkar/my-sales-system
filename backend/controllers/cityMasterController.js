// const cityMasterModule = require("../modules/cityMasterModule");

// exports.saveCity = async (req, res) => {
//   try {
//     await cityMasterModule.saveCity(req.body);
//     res.status(200).json({
//       success: true,
//       message: "City saved successfully"
//     });
//   } catch (error) {
//     console.error("Save City Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error saving city"
//     });
//   }
// };


const cityMasterModule = require("../modules/cityMasterModule");

/* SAVE */
exports.saveCity = async (req, res) => {
  try {
    await cityMasterModule.saveCity(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/* LIST */
exports.listCities = async (req, res) => {
  try {
    const data = await cityMasterModule.listCities();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

/* DELETE */
exports.deleteCity = async (req, res) => {
  try {
    await cityMasterModule.deleteCity(req.params.cityId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

exports.updateCity = async (req, res) => {
  try {
    await cityMasterModule.updateCity(req.params.cityId, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

