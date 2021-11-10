const fs = require("fs");
const multer = require("multer");
//files storage
//files storage
const storage = () =>
  multer.diskStorage({
    // Defining the path where we have to store the image
    destination: (req, file, cb) => {
      var dest = "uploads/images";
      var stat = null;
      try {
        stat = fs.statSync(dest);
      } catch (err) {
        fs.mkdirSync(dest);
      }
      if (stat && !stat.isDirectory()) {
        throw new Error(
          'Directory cannot be created because an inode of a different type exists at "' +
            dest +
            '"'
        );
      }
      cb(null, dest);
    },
    // Creating a unique filename to avoid duplication error
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
// Multer strategy for local uploading. (Read multer's documentation for more details)
exports.upload = multer({
  // to store images
  storage: storage(),
  // File size limit upto 5 mb
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
