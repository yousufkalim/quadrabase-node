const ArchitectsChap0 = require("../models/ArchitectsChap0");
const Architects = require("../models/Architects");
const Chap0 = require("../models/Chap0");
const Projects = require("../models/Projects");

//ArchitectsChap0 create
exports.create = async (req, res) => {
  try {
    const existingTitle = await ArchitectsChap0.findOne({
      title: req.body.title,
      architect: req.body.architect,
    }); // Finding already existing ArchitectsChap0
    if (existingTitle) {
      // If we found existing ArchitectsChap0 in db
      return res
        .status(401)
        .json({ success: false, message: "ArchitectsChap0 already exists" });
    }

    const architectsChap0 = await ArchitectsChap0.create(req.body);

    let architect = await Architects.findByIdAndUpdate(
      req.body.architect,
      { $push: { chap0part2: architectsChap0._id } },
      { new: true }
    );

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
 * Get ArchitectsChap0 by architect id
 * @param {object} req
 * @param {object} res
 */
exports.getByIdArchitectId = async (req, res) => {
  try {
    const architectsChap0 = await ArchitectsChap0.find({
      architect: req.userId,
    }); // Finding architectsChap0 by architectId
    res.json({ success: true, architectsChap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPrivate = async (req, res) => {
  try {
    const architectsChap0 = await ArchitectsChap0.find({
      architect: req.userId,
      type: "private",
    }); // Finding architectsChap0 by architectId
    res.json({ success: true, architectsChap0 }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const architectsChap0 = await ArchitectsChap0.find({
      architect: req.userId,
    }); // Finding architectsChap0 by architectId
    const chap0 = await Chap0.find();
    let data = {
      architectsChap0,
      chap0,
    };
    res.json({ success: true, data }); // Success
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

exports.updateByProject = async (req, res) => {
  try {
    if (req.body.status === "modified") {
      const architectsChap0Id = req.params.architectsChap0Id; // Getting architectsChap0Id from URL parameter

      const architectsChap0 = await ArchitectsChap0.findByIdAndUpdate(
        architectsChap0Id,
        { title: req.body.title, text: req.body.text },
        {
          new: true,
        }
      ); // Updating the ArchitectsChap0
      res.json({
        success: true,
        message: "ArchitectsChap0 updated successfully",
        architectsChap0,
      }); // Success
    } else if (req.body.status === "selected") {
      const architectsChap0 = await ArchitectsChap0.create({
        title: req.body.title,
        text: req.body.text,
        architect: req.userId,
      });

      await Architects.findByIdAndUpdate(
        req.body.architect,
        { $push: { chap0part2: architectsChap0._id } },
        { new: true }
      );

      const projectId = req.params.projectId; // Getting projectId from URL parameter
      await Projects.findByIdAndUpdate(
        projectId,
        {
          chap0part2: {
            id: architectsChap0._id,
            status: "modified",
          },
        },
        {
          new: true,
        }
      ); // Updating the project
      console.log("dah dah dah");
      res.json({
        success: true,
        message: "ArchitectsChap0 updated successfully",
        architectsChap0,
      }); // Success
    }
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

    const inUseChap0part2 = await Projects.findOne({
      "chap0part2.id": architectsChap0Id,
    });
    if (inUseChap0part2) {
      // If we found existing stakeholder in db
      return res.status(401).json({
        success: false,
        message: "ArchitectsChap0 in use of a project",
      });
    }

    const architectsChap0 = await ArchitectsChap0.findByIdAndDelete(
      architectsChap0Id
    ); // Deleting the architectsChap0

    await Architects.findByIdAndUpdate(
      architectsChap0.architect,
      { $pull: { chap0part2: architectsChap0Id } },
      { new: true }
    );

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
