const StakeholderTypes = require("../models/StakeholderTypes");

//unit create
exports.create = async (req, res) => {
  try {
    let text = req.body.text; //name
    const existingStakeholderType = await StakeholderTypes.findOne({ text }); // Finding already existing unit
    if (existingStakeholderType) {
      // If we found existing unit in db
      return res
        .status(404)
        .json({ success: false, message: "Stakeholder Type already exists." });
    }

    // Creating unit
    const stakeholderTypes = await StakeholderTypes.create(req.body); // Adding unit in db

    // Done
    res.json({
      message: "Stakeholder Type created successfully",
      stakeholderTypes,
    }); //Success
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
    const stakeholderTypes = await StakeholderTypes.find().sort([
      ["createdAt", -1],
    ]); // Finding all the Units from db
    res.json({ success: true, stakeholderTypes }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update unit
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const stakeholderTypeId = req.params.stakeholderTypeId; // Getting stakeholderTypeId from URL parameter

    const stakeholderTypes = await StakeholderTypes.findByIdAndUpdate(
      stakeholderTypeId,
      req.body,
      {}
    ); // Updating the unit
    res.json({
      success: true,
      message: "Stakeholder type updated successfully",
      stakeholderTypes,
    }); // Success
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
    const stakeholderTypeId = req.params.stakeholderTypeId; // Getting stakeholderTypeId from URL parameter
    const stakeholderTypes = await StakeholderTypes.findByIdAndDelete(
      stakeholderTypeId
    ); // Deleting the unit
    res.json({
      success: true,
      message: "Stakeholder type deleted successfully",
      stakeholderTypes,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
