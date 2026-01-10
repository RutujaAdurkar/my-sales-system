const stateModule = require("../modules/stateModule");

exports.getStates = async (req, res) => {
  try {
    const states = await stateModule.getStates();
    res.status(200).json(states);
  } catch (error) {
    console.error("Get States Error:", error);
    res.status(500).json({ message: "Error fetching states" });
  }
};
