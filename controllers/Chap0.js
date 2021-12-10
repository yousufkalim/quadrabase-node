const Chap0 = require("../models/Chap0");

//chap0 create
exports.create = async (req, res) => {
  try {
    let title = req.body.title; //title
    const existingChap = await Chap0.findOne({ title }); // Finding already existing Chap0
    if (existingChap) {
      // If we found existing Chap0 in db
      return res
        .status(404)
        .json({ success: false, message: "Chap already exists." });
    }

    // Creating Chap0
    const chap0 = await Chap0.create(req.body); // Adding Chap0 in db

    // Done
    res.json({ message: "Chap0 created successfully", chap0 }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Chap0
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const chap0 = await Chap0.find().sort([["createdAt", -1]]); // Finding all the Chap0 from db
    res.json({ success: true, chap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get Chap0 by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0 id from URL parameter
    const chap0 = await Chap0.findById(Chap0Id); // Finding chap0 by id
    res.json({ success: true, chap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update chap0
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0 id from URL parameter

    const chap0 = await Chap0.findByIdAndUpdate(Chap0Id, req.body, {
      new: true,
    }); // Updating the chap0
    res.json({ success: true, message: "Chap0 updated successfully", chap0 }); // Success
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
    const Chap0Id = req.params.Chap0Id; // Getting chap0 id from URL parameter
    const chap0 = await Chap0.findByIdAndDelete(Chap0Id); // Deleting the chap0
    res.json({ success: true, chap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
