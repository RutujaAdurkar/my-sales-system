// // // const stateMasterModule = require("../modules/stateMasterModule");

// // // exports.saveState = async (req, res) => {
// // //   try {
// // //     await stateMasterModule.saveState(req.body);
// // //     res.json({ success: true, message: "State saved successfully" });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ success: false, message: "Error saving state" });
// // //   }
// // // };


// // const stateMasterModule = require("../modules/stateMasterModule");

// // exports.saveState = async (req, res) => {
// //   try {
// //     console.log("REQUEST BODY:", req.body); // 🔍 ADD THIS

// //     if (!req.body.stateName) {
// //       return res.status(400).json({
// //         message: "StateName is required"
// //       });
// //     }

// //     await stateMasterModule.saveState(req.body);

// //     res.json({
// //       success: true,
// //       message: "State saved successfully"
// //     });
// //   } catch (err) {
// //     console.error("Save State Error:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error saving state"
// //     });
// //   }
// // };


// // const stateMasterModule = require("../modules/stateMasterModule");

// // exports.saveState = async (req, res) => {
// //   try {
// //     const { stateName } = req.body;

// //     if (!stateName) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "State Name is required"
// //       });
// //     }

// //     // ✅ DUPLICATE CHECK
// //     const isDuplicate = await stateMasterModule.checkDuplicateState(stateName);

// //     if (isDuplicate) {
// //       return res.status(409).json({
// //         success: false,
// //         message: "State already exists"
// //       });
// //     }

// //     await stateMasterModule.saveState({ stateName });

// //     res.json({
// //       success: true,
// //       message: "State saved successfully"
// //     });
// //   } catch (err) {
// //     console.error("Save State Error:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error saving state"
// //     });
// //   }
// // };


// const stateMasterModule = require("../modules/stateMasterModule");

// exports.saveState = async (req, res) => {
//   try {
//     const { stateName } = req.body;

//     // 🔴 REQUIRED VALIDATION
//     if (!stateName || stateName.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "State Name is required"
//       });
//     }

//     // 🔴 DUPLICATE CHECK (CASE INSENSITIVE)
//     const isDuplicate = await stateMasterModule.checkDuplicateState(
//       stateName.trim()
//     );

//     if (isDuplicate) {
//       return res.status(409).json({
//         success: false,
//         message: "State already exists"
//       });
//     }

//     // 🟢 SAVE ONLY IF NOT EXISTS
//     await stateMasterModule.saveState({
//       stateName: stateName.trim()
//     });

//     res.status(201).json({
//       success: true,
//       message: "State saved successfully"
//     });

//   } catch (err) {
//     console.error("Save State Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error saving state"
//     });
//   }
// };


const stateMasterModule = require("../modules/stateMasterModule");

/* SAVE (already exists) */
exports.saveState = async (req, res) => {
  try {
    const { stateName } = req.body;

    if (!stateName || stateName.trim() === "") {
      return res.status(400).json({ message: "State Name required" });
    }

    const isDuplicate = await stateMasterModule.checkDuplicateState(stateName);
    if (isDuplicate) {
      return res.status(409).json({ message: "State already exists" });
    }

    await stateMasterModule.saveState({ stateName });
    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* ✅ LIST */
exports.listStates = async (req, res) => {
  try {
    const data = await stateMasterModule.listStates();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

/* ✅ DELETE */
exports.deleteState = async (req, res) => {
  try {
    await stateMasterModule.deleteState(req.params.StateId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { stateName } = req.body;
    const { StateId } = req.params;

    if (!stateName || stateName.trim() === "") {
      return res.status(400).json({ message: "State Name required" });
    }

    // 🔴 CHECK DUPLICATE EXCEPT CURRENT ID
    const isDuplicate = await stateMasterModule.checkDuplicateStateExceptId(
      stateName,
      StateId
    );

    if (isDuplicate) {
      return res.status(409).json({ message: "State already exists" });
    }

    await stateMasterModule.updateState(StateId, stateName);
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
