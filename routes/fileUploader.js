const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");

//for single image upload
router.post("/", upload("/", "file", "array"), async (req, res) => {
  try {
    let files = req.files;
    let array = [];
    files.map((dt) => array.push(dt.path));
    res.json({ files: array });
  } catch (error) {
    console.log("error message----->", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
