const Units = require("../models/Units");

//unit create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingUnit = await Units.findOne({ name }); // Finding already existing unit
    if (existingUnit) {
      // If we found existing unit in db
      return res
        .status(404)
        .json({ success: false, message: "Unit already exists" });
    }

    // Creating unit
    const unit = await Units.create(req.body); // Adding unit in db

    // Done
    res.json({ message: "Unit created successfully", unit }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const units = await Units.find().sort([["createdAt", -1]]); // Finding all the Units from db
    res.json({ success: true, units }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get unit by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const unitsId = req.params.unitsId; // Getting unit id from URL parameter
    const unit = await Units.findById(unitsId); // Finding unit by id
    res.json({ success: true, unit }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update unit
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const unitsId = req.params.unitsId; // Getting unit id from URL parameter

    const unit = await Units.findByIdAndUpdate(unitsId, req.body, {}); // Updating the unit
    res.json({ success: true, message: "Unit updated successfully", unit }); // Success
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
    const unitsId = req.params.unitsId; // Getting unit id from URL parameter
    const unit = await Units.findByIdAndDelete(unitsId); // Deleting the unit
    res.json({ success: true, message: "Unit deleted successfully", unit }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
