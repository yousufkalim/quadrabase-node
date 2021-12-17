const multer = require("multer");
const fs = require("fs");

const storage = (field) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      let folder = folderName(file.mimetype);
      var dest = "uploads/" + folder;
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
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

async function addPathToBody(req, res, next) {
  if (req.files) {
    if (!Array.isArray(req.files)) {
      let files = {};
      Object.keys(req.files).map((key) => (files[key] = { files: [] }));
      for (var key in req.files) {
        req.files[key].map((file) =>
          files[key].files.push(
            file.path != undefined ? file.path.replace(/\\/g, "/") : null
          )
        );
        req.body["images"] = files;
      }
    } else {
      let files = [];
      req.files.map((file) => {
        files.push(
          file.path != undefined ? file.path.replace(/\\/g, "/") : null
        );
      });
      req.body["images"] = files;
    }
  }
  if (req.file) req.body["image"] = req.file.path.replace(/\\/g, "/");
  next();
}

const uploader = (folder) =>
  multer({
    storage: storage(folder),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

module.exports = (folder = "/", field, type = "single") => {
  return [
    type === "array"
      ? uploader(folder).array(field)
      : type === "fields"
      ? uploader(folder).fields(field)
      : uploader(field).single(field),
    addPathToBody,
  ];
};
//spcify folder name against mimeType
function folderName(type) {
  let folder;
  let typeCheck = type.split("/");
  if (typeCheck[0] == "video") {
    folder = "video_files";
  } else if (typeCheck[0] == "image") {
    folder = "images";
  } else if (typeCheck[0] == "audio") {
    folder = "audio_files";
  } else {
    folder = "documents";
  }
  return folder;
}
