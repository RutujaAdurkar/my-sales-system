const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage: storage
}).single("diagram_file");  // MUST MATCH FRONTEND FIELD NAME

module.exports = upload;
