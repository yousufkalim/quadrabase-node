const CCTP = require("../models/CCTP");

//CCTP create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingCCTP = await CCTP.findOne({ name }); // Finding already existing CCTP
    if (existingCCTP) {
      // If we found existing CCTP in db
      return res
        .status(404)
        .json({ success: false, message: "CCTP already exists" });
    }

    // Creating CCTP
    const cctp = await CCTP.create(req.body); // Adding CCTP in db

    // Done
    res.json({ message: "CCTP created successfully", cctp }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all CCTP
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const cctp = await CCTP.find().sort([["createdAt", -1]]); // Finding all the CCTP from db
    res.json({ success: true, cctp }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get CCTP by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const CCTPId = req.params.CCTPId; // Getting CCTP id from URL parameter
    const cctp = await CCTP.findById(CCTPId); // Finding CCTP by id
    res.json({ success: true, cctp }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update CCTP
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const CCTPId = req.params.CCTPId; // Getting CCTP id from URL parameter

    const cctp = await CCTP.findByIdAndUpdate(CCTPId, req.body, {}); // Updating the CCTP
    res.json({ success: true, message: "CCTP updated successfully", cctp }); // Success
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
    const CCTPId = req.params.CCTPId; // Getting CCTP id from URL parameter
    const cctp = await CCTP.findByIdAndDelete(CCTPId); // Deleting the CCTP
    res.json({ success: true, message: "CCTP deleted successfully", cctp }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
