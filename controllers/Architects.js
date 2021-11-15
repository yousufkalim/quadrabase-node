const Architects = require("../models/Architects");

//architect create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingarchitect = await Architects.findOne({ name }); // Finding already existing architect
    if (existingarchitect) {
      // If we found existing architect in db
      return res
        .status(404)
        .json({ success: false, message: "Architect already exists." });
    }
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }

    // Creating architect
    const architect = await Architects.create(req.body); // Adding architect in db

    // Done
    res.json({ message: "Architect created successfully", architect }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Architects
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const architect = await Architects.find(); // Finding all the Architects from db
    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get architect by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    const architect = await Architects.findById(architectId); // Finding architect by id
    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update architect
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    const architect = await Architects.findByIdAndUpdate(
      architectId,
      req.body,
      {
        new: true,
      }
    ); // Updating the architect
    res.json({
      success: true,
      message: "Architect updated successfully",
      architect,
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
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    const architect = await Architects.findByIdAndDelete(architectId); // Deleting the architect
    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
