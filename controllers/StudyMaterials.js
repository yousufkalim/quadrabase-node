
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

    const folders = fs.readdirSync(dirPath);
    const foldersArr = [];

    for( let i = 0; i < folders.length; i++ ){

      const folder = folders[i];

      const files = fs.readdirSync(path.join(dirPath, folder));
      const filesArr = [];

      for( let j = 0; j < files.length; j++ ){

        const file = files[j];

        const fileStats = fs.statSync(path.join(dirPath, folder, file));
        const fileSize = fileStats.size / 1024;

        const fileObj = {
          name: file,
          path: `uploads/study_materials/${folder}/${file}`,
          size: `${fileSize.toFixed(2)} KB`
        };

        filesArr.push(fileObj);

      }

      const folderObj = {
        name: folder,
        files: filesArr
      }

      foldersArr.push(folderObj);
      
    }
    res.json({ success: true, filesArr: foldersArr }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

