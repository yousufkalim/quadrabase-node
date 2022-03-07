
const path = require("path");
const fs = require("fs");

/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const rootPath = __dirname.replace("controllers", "");
    const dirPath = path.join(rootPath, "uploads", "study_materials");
    const files = fs.readdirSync(dirPath);
    const filesArr = [];
    files.forEach(_ => {
      const fileStats = fs.statSync(path.join(dirPath, _));
      const fileSize = fileStats.size / 1024;
      filesArr.push({
        name: _,
        path: `uploads/study_materials/${_}`,
        size: `${fileSize.toFixed(2)} KB`
      });
    });
    res.json({ success: true, filesArr }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

