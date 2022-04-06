const Tranches = require("../models/Tranches");
const Projects = require("../models/Projects");

/**
 * Create tranch
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let name = req.body.name; // name
    const existingTranch = await Tranches.findOne({
      name,
      trade: req.body.trade,
    }); // Finding already existing Tranch
    if (existingTranch) {
      // If we found existing tranch in db
      return res
        .status(404)
        .json({ success: false, message: "Tranch already exists" });
    }

    // Creating Tranch
    const tranch = await Tranches.create(req.body); // Adding Tranch in db

    // Done
    res.json({ message: "Tranch created successfully", tranch }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all tranches
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const tranches = await Tranches.find({ project: req.params.projectId });
    res.json({ success: true, tranches }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update tranch
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const tranchId = req.params.tranchId; // Getting tranchId from URL parameter

    const tranch = await Tranches.findByIdAndUpdate(tranchId, req.body, {
      new: true,
    }); // Updating the tranch
    res.json({ success: true, message: "Tranch updated successfully", tranch }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete tranch
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const tranchId = req.params.tranchId; // Getting tranchId from URL parameter
    const tranch = await Tranches.findByIdAndDelete(tranchId); // Deleting the tranch
    res.json({ success: true, message: "Tranch deleted successfully", tranch }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
