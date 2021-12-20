const Stakeholders = require("../models/Stakeholders");
const Architects = require("../models/Architects");

//CCTP create
exports.create = async (req, res) => {
  try {
    const existingStakeholder = await Stakeholders.findOne({
      email: req.body.email,
    }); // Finding already existing stakeholder
    if (existingStakeholder) {
      // If we found existing stakeholder in db
      return res
        .status(401)
        .json({ success: false, message: "stakeholder already exists" });
    }

    const stakeholder = await Stakeholders.create(req.body);

    let architect = await Architects.findById(req.params.architectId);
    architect.stakeholders.push(stakeholder._id);
    await architect.save();

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
 * Get all CCTP
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const stakeholder = await Stakeholders.find(); // Finding all the Stakeholders from db
    res.json({ success: true, stakeholder }); // Success
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
 * Update CCTP
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
    ); // Updating the CCTP
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
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const stakeholderID = req.params.stakeholderID; // Getting stakeholderID from URL parameter
    await Stakeholders.findByIdAndDelete(stakeholderID); // Deleting the stakeholder

    const architectId = req.params.architectId; // Getting architectId from URL parameter
    let architect = await Architects.findById(architectId); // finding architect
    let stakeholderIDs = architect.stakeholders.filter(
      (item) => item != stakeholderID
    ); //// filtering out deleted stakeholder
    architect.stakeholders = stakeholderIDs;
    await architect.save();

    res.json({
      success: true,
      message: "Stakeholder deleted successfully",
      architect,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
