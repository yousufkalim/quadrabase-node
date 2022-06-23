const Folders = require("../models/Folders");
const fs = require("fs");
const path = require("path").resolve(__dirname, "..");
const { promisify } = require("util");

//Folders create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingFolder = await Folders.findOne({ name, parentFolder: null }); // Finding already existing Folders
    if (existingFolder) {
      // If we found existing Folders in db
      return res.status(404).json({ success: false, message: "Folder already exists" });
    }

    // Creating Folders
    const folder = await Folders.create(req.body); // Adding Folders in db

    // Done
    res.json({ message: "Folder created successfully", folder }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//SubFolders create
exports.createSubFolder = async (req, res) => {
  try {
    let parentId = req.params.parentId; //name
    const parent = await Folders.findById(parentId).populate("subFolders"); // Finding already existing Folders
    if (!parent) {
      // If we found existing Folders in db
      return res.status(404).json({ success: false, message: "Parent folder doesn't exist" });
    }

    let name = req.body.name; //name
    const existingFolder = parent.subFolders.find((item) => item.name === name); // Finding already existing Folders
    if (existingFolder) {
      // If we found existing Folders in db
      return res.status(404).json({ success: false, message: "Subfolder already exists" });
    }

    req.body.parentFolder = parent._id;
    // Creating Folders
    const folder = await Folders.create(req.body); // Adding Folders in db

    await Folders.findByIdAndUpdate(parentId, { $push: { subFolders: folder._id } });

    // Done
    res.json({ message: "Subfolder created successfully", folder }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Folders
 * @param {object} req
 * @param {object} res
 */
exports.getAllFolders = async (req, res) => {
  try {
    const folder = await Folders.find({ parentFolder: null }).sort([["createdAt", -1]]); // Finding all the Folders from db
    res.json({ success: true, folder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get Folders by id
 * @param {object} req
 * @param {object} res
 */
exports.getSubFolders = async (req, res) => {
  try {
    const parentId = req.params.parentId; // Getting Folders id from URL parameter
    const folder = await Folders.find({ parentFolder: parentId }); // Finding Folders by id
    const parentFolder = await Folders.findById(parentId); // Finding Folders by id
    res.json({ success: true, folder, parentFolder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Folders
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const id = req.params.id; // Getting Folders id from URL parameter

    const folder = await Folders.findByIdAndUpdate(id, req.body, { new: true }); // Updating the Folders
    res.json({ success: true, message: "Folder updated successfully", folder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update file
 * @param {object} req
 * @param {object} res
 */
exports.updateFile = async (req, res) => {
  try {
    const id = req.params.id; // Getting Folders id from URL parameter
    const folder = await Folders.findById(id); // Updating the Folders

    if (req.body.type === "docx") {
      folder.files.docx.map((item) => {
        if (item._id.toString() === req.body._id.toString()) {
          item.name = req.body.name;
        }
      });
    } else if (req.body.type === "videos") {
      folder.files.videos.map((item) => {
        if (item._id.toString() === req.body._id.toString()) {
          item.name = req.body.name;
        }
      });
    } else if (req.body.type === "images") {
      folder.files.images.map((item) => {
        if (item._id.toString() === req.body._id.toString()) {
          item.name = req.body.name;
        }
      });
    }
    folder.save();

    res.json({ success: true, message: "File updated successfully", folder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete file
 * @param {object} req
 * @param {object} res
 */
exports.deleteFile = async (req, res) => {
  try {
    const id = req.params.id; // Getting Folders id from URL parameter

    if (req.body.type === "docx") {
      await Folders.findByIdAndUpdate(id, { $pull: { "files.docx": { _id: req.body._id } } }, { new: true }); // Updating the Folders
    } else if (req.body.type === "videos") {
      await Folders.findByIdAndUpdate(id, { $pull: { "files.videos": { _id: req.body._id } } }, { new: true }); // Updating the Folders
    } else if (req.body.type === "images") {
      await Folders.findByIdAndUpdate(id, { $pull: { "files.images": { _id: req.body._id } } }, { new: true }); // Updating the Folders
    }

    res.json({ success: true, message: "File deleted successfully" }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Folders
 * @param {object} req
 * @param {object} res
 */
exports.uploadFile = async (req, res) => {
  try {
    if (req.file) {
      const id = req.params.id; // Getting Folders id from URL parameter
      let typeCheck = req.file.mimetype.split("/");
      let folder = "";
      if (typeCheck[0] === "video") {
        folder = await Folders.findByIdAndUpdate(
          id,
          { $push: { "files.videos": { uri: req.file.path, name: req.body.name } } },
          { new: true }
        ); //push file path
      } else if (typeCheck[0] === "image") {
        folder = await Folders.findByIdAndUpdate(
          id,
          { $push: { "files.images": { uri: req.file.path, name: req.body.name } } },
          { new: true }
        ); //push file path
      } else {
        folder = await Folders.findByIdAndUpdate(
          id,
          { $push: { "files.docx": { uri: req.file.path, name: req.body.name } } },
          { new: true }
        ); //push file path
      }
      res.json({ success: true, message: "File uploaded successfully", folder }); // Success
    } else {
      res.json({ success: false, message: "No file to upload" }); // Success
    }
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id; // Getting Folders id from URL parameter
    const deletedFolder = await Folders.findById(id).populate("subFolders"); // Deleting the Folders

    let folders = deletedFolder.subFolders;

    for (let i = 0; i < folders.length; i++) {
      let subfolder = await Folders.findById(folders[i]._id).populate("subFolders");
      if (subfolder?.subFolders) {
        folders = [...folders, ...subfolder.subFolders];
      }
    }
    folders.unshift(deletedFolder);

    const unlinkSync = promisify(fs.unlink);

    let toDelete = [];
    folders.map((item) => {
      Object.keys(item.files).map(function (key, index) {
        if (item.files[key].length > 0) {
          item.files[key].map((item) => {
            unlinkSync(path + "/" + item.uri);
          });
        }
      });
      toDelete.push(item._id);
    });
    await Folders.deleteMany({ _id: { $in: toDelete } });

    res.json({ success: true, message: "Folders deleted successfully", folders }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
