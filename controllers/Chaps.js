const Chaps = require("../models/Chaps");

//chaps create
exports.create = async (req, res) => {
  try {
    let title = req.body.title; //title
    const existingChap = await Chaps.findOne({ title }); // Finding already existing chaps
    if (existingChap) {
      // If we found existing chaps in db
      return res
        .status(404)
        .json({ success: false, message: "Chap already exists." });
    }

    // Creating chaps
    const chaps = await Chaps.create(req.body); // Adding chaps in db

    // Done
    res.json({ message: "chaps created successfully", chaps }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Chaps
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const Chaps = await Chaps.find(); // Finding all the Chaps from db
    res.json({ success: true, Chaps }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get chaps by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const chapsId = req.params.chapsId; // Getting chaps id from URL parameter
    const chaps = await Chaps.findById(chapsId); // Finding chaps by id
    res.json({ success: true, chaps }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update chaps
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const chapsId = req.params.chapsId; // Getting chaps id from URL parameter

    const chaps = await Chaps.findByIdAndUpdate(chapsId, req.body, {
      new: true,
    }); // Updating the chaps
    res.json({ success: true, chaps }); // Success
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
    const chapsId = req.params.chapsId; // Getting chaps id from URL parameter
    const chaps = await Chaps.findByIdAndDelete(chapsId); // Deleting the chaps
    res.json({ success: true, chaps }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
