const Chap0Level2 = require("../models/Chap0Level2");

//chap0Level2 create
exports.create = async (req, res) => {
  try {
    // Creating Chap0Level2
    const chap0Level2 = await Chap0Level2.create(req.body); // Adding Chap0Level2 in db

    // Done
    res.json({ message: "Chap0Level2 created successfully", chap0Level2 }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Chap0Level2
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const chap0Level2 = await Chap0Level2.find().sort([["createdAt", -1]]); // Finding all the Chap0Level2 from db
    res.json({ success: true, chap0Level2 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get Chap0Level2 by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level2 id from URL parameter
    const chap0Level2 = await Chap0Level2.findById(Chap0Id); // Finding chap0Level2 by id
    res.json({ success: true, chap0Level2 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Chap0Level2 by id
 * @param {object} req
 * @param {object} res
 */
exports.getbyParentId = async (req, res) => {
  try {
    const parentId = req.params.parentId; // Getting chap0Level2 id from URL parameter
    const chap0Level2 = await Chap0Level2.find({ parentLevel: parentId }); // Finding chap0Level2 by id
    res.json({ success: true, chap0Level2 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update chap0Level2
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level2 id from URL parameter

    const chap0Level2 = await Chap0Level2.findByIdAndUpdate(Chap0Id, req.body, {
      new: true,
    }); // Updating the chap0Level2
    res.json({
      success: true,
      message: "Chap0Level2 updated successfully",
      chap0Level2,
    }); // Success
  } catch (err) {
    // Error handlings
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
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level2 id from URL parameter
    const chap0Level2 = await Chap0Level2.findByIdAndDelete(Chap0Id); // Deleting the chap0Level2
    res.json({
      success: true,
      message: "Chap0Level2 deleted successfully",
      chap0Level2,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
