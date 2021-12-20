const ArchitectsChap0 = require("../models/ArchitectsChap0");
const Architects = require("../models/Architects");

//ArchitectsChap0 create
exports.create = async (req, res) => {
  try {
    const existingTitle = await ArchitectsChap0.findOne({
      title: req.body.title,
    }); // Finding already existing ArchitectsChap0
    if (existingTitle) {
      // If we found existing ArchitectsChap0 in db
      return res
        .status(401)
        .json({ success: false, message: "ArchitectsChap0 already exists" });
    }

    const architectsChap0 = await ArchitectsChap0.create(req.body);

    let architect = await Architects.findById(req.body.architect);
    architect.chap0part2.push(architectsChap0._id);
    await architect.save();

    res.json({
      message: "ArchitectsChap0 created successfully",
      architectsChap0,
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all ArchitectsChap0
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const architectsChap0 = await ArchitectsChap0.find(); // Finding all the architectsChap0 from db
    res.json({ success: true, architectsChap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get ArchitectsChap0 by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const architectsChap0Id = req.params.architectsChap0Id; // Getting architectsChap0Id from URL parameter
    const architectsChap0 = await ArchitectsChap0.findById(architectsChap0Id); // Finding architectsChap0 by id
    res.json({ success: true, architectsChap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update ArchitectsChap0
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const architectsChap0Id = req.params.architectsChap0Id; // Getting architectsChap0Id from URL parameter

    const architectsChap0 = await ArchitectsChap0.findByIdAndUpdate(
      architectsChap0Id,
      req.body,
      {
        new: true,
      }
    ); // Updating the ArchitectsChap0
    res.json({
      success: true,
      message: "ArchitectsChap0 updated successfully",
      architectsChap0,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete ArchitectsChap0
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const architectsChap0Id = req.params.architectsChap0Id; // Getting architectsChap0Id from URL parameter
    const architectsChap0 = await ArchitectsChap0.findByIdAndDelete(
      architectsChap0Id
    ); // Deleting the architectsChap0

    let architect = await Architects.findById(architectsChap0.architect); // finding architect
    let architectsChap0Ids = architect.chap0part2.filter(
      (item) => item != architectsChap0Id
    ); //// filtering out deleted architectsChap0
    architect.chap0part2 = architectsChap0Ids;
    await architect.save();

    res.json({
      success: true,
      message: "ArchitectsChap0 deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
