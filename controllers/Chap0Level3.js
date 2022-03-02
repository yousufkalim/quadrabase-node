const Chap0Level3 = require("../models/Chap0Level3");

//chap0Level3 create
exports.create = async (req, res) => {
  try {
    // Creating Chap0Level3
    const chap0Level3 = await Chap0Level3.create(req.body); // Adding Chap0Level3 in db

    // Done
    res.json({ message: "Chap0Level3 created successfully", chap0Level3 }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Chap0Level3
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const chap0Level3 = await Chap0Level3.find().sort([["createdAt", -1]]); // Finding all the Chap0Level3 from db
    res.json({ success: true, chap0Level3 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get Chap0Level3 by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level3 id from URL parameter
    const chap0Level3 = await Chap0Level3.findById(Chap0Id); // Finding chap0Level3 by id
    res.json({ success: true, chap0Level3 }); // Success
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
    const chap0Level3 = await Chap0Level3.find({ parentLevel: parentId }); // Finding chap0Level2 by id
    res.json({ success: true, chap0Level3 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update chap0Level3
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level3 id from URL parameter

    const chap0Level3 = await Chap0Level3.findByIdAndUpdate(Chap0Id, req.body, {
      new: true,
    }); // Updating the chap0Level3
    res.json({
      success: true,
      message: "Chap0Level3 updated successfully",
      chap0Level3,
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
    const Chap0Id = req.params.Chap0Id; // Getting chap0Level3 id from URL parameter
    const chap0Level3 = await Chap0Level3.findByIdAndDelete(Chap0Id); // Deleting the chap0Level3
    res.json({
      success: true,
      message: "Chap0Level3 deleted successfully",
      chap0Level3,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
