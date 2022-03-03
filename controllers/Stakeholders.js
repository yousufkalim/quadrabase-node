const Stakeholders = require("../models/Stakeholders");
const Architects = require("../models/Architects");
const Projects = require("../models/Projects");

//stakeholders create
exports.create = async (req, res) => {
  try {
    const existingStakeholder = await Stakeholders.findOne({
      name: req.body.name,
    }); // Finding already existing stakeholder
    if (existingStakeholder) {
      // If we found existing stakeholder in db
      return res
        .status(401)
        .json({ success: false, message: "stakeholder already exists" });
    }

    await Stakeholders.create(req.body); //stakeholder create

    res.json({
      message: "Stakeholder created successfully",
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createByArchitect = async (req, res) => {
  try {
    const architect = await Architects.findOne({
      _id: req.params.architectId,
    }).populate("stakeholders");

    const existingStakeholder = architect.stakeholders.find(
      (item) => item.name == req.body.name
    );

    if (existingStakeholder) {
      // If we found existing stakeholder in db
      return res
        .status(401)
        .json({ success: false, message: "stakeholder already exists" });
    }

    const stakeholder = await Stakeholders.create(req.body);

    await Architects.findByIdAndUpdate(
      req.params.architectId,
      { $push: { stakeholders: stakeholder._id } },
      { new: true }
    );

    res.json({
      message: "Stakeholder created successfully",
      stakeholder,
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all stakeholders
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const stakeholders = await Stakeholders.find()
      .populate("type")
      .sort({ ranking: 1 }); // Finding all the Stakeholders from db
    res.json({ success: true, stakeholders }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get stakeholders by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const stakeholderID = req.params.stakeholderID; // Getting stakeholder id from URL parameter
    const stakeholder = await Stakeholders.findById(stakeholderID); // Finding stakeholder by id
    res.json({ success: true, stakeholder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get stakeholders by type id
 * @param {object} req
 * @param {object} res
 */
exports.getByType = async (req, res) => {
  try {
    const typeId = req.params.typeId; // Getting stakeholder id from URL parameter
    const stakeholder = await Stakeholders.find({ type: typeId }); // Finding stakeholder by id
    res.json({ success: true, stakeholder }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update stakeholders
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const stakeholderID = req.params.stakeholderID; // Getting stakeholderID from URL parameter

    const stakeholder = await Stakeholders.findByIdAndUpdate(
      stakeholderID,
      req.body,
      {
        new: true,
      }
    ); // Updating the stakeholders
    res.json({
      success: true,
      message: "Stakeholder updated successfully",
      stakeholder,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete stakeholder
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const stakeholderID = req.params.stakeholderID; // Getting stakeholderID from URL parameter
    await Stakeholders.findByIdAndDelete(stakeholderID); // Deleting the stakeholder

    res.json({
      success: true,
      message: "Stakeholder deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteByArchitect = async (req, res) => {
  try {
    const stakeholderID = req.params.stakeholderID; // Getting stakeholderID from URL parameter

    const inUseStakholder = await Projects.findOne({
      stakeholders: { $all: [stakeholderID] },
    });
    if (inUseStakholder) {
      // If we found existing stakeholder in db
      return res
        .status(401)
        .json({ success: false, message: "Stakeholder in use of a project" });
    }

    await Stakeholders.findByIdAndDelete(stakeholderID); // Deleting the stakeholder

    const architectId = req.params.architectId; // Getting architectId from URL parameter
    await Architects.findByIdAndUpdate(
      architectId,
      { $pull: { stakeholders: stakeholderID } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Stakeholder deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
