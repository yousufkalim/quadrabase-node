const Projects = require("../models/Projects");
const Architects = require("../models/Architects");
const Works = require("../models/Works");
const mongoose = require("mongoose");

//Projects create
exports.create = async (req, res) => {
  try {
    const existingProjects = await Projects.findOne({
      name: req.body.name,
    }); // Finding already existing Projects
    if (existingProjects) {
      // If we found existing Projects in db
      return res
        .status(401)
        .json({ success: false, message: "Project already exists" });
    }

    const project = await Projects.create(req.body);

    let architect = await Architects.findByIdAndUpdate(
      req.body.architect,
      { $push: { projects: project._id } },
      { new: true }
    );

    res.json({
      message: "Project created successfully",
      project,
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Projects
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const project = await Projects.find(); // Finding all the Project from db
    res.json({ success: true, project }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get project by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Getting projectId from URL parameter
    const project = await Projects.findById(projectId); // Finding project by id
    res.json({ success: true, project }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update project
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Getting projectId from URL parameter

    const project = await Projects.findByIdAndUpdate(projectId, req.body, {
      new: true,
    }); // Updating the project
    res.json({
      success: true,
      message: "Project updated successfully",
      project,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete project
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Getting projectId from URL parameter
    const project = await Projects.findByIdAndDelete(projectId); // Deleting the project

    let architect = await Architects.findByIdAndUpdate(
      project.architect,
      { $pull: { projects: projectId } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Project deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

//Add work to project
exports.addWork = async (req, res) => {
  try {
    const work = await Works.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.body.workId),
        },
      },
      {
        $unwind: {
          path: "$work_details",
        },
      },
      {
        $match: {
          work_details: mongoose.Types.ObjectId(req.body.workDetailId),
        },
      },
      {
        $lookup: {
          from: "workdetails",
          localField: "work_details",
          foreignField: "_id",
          as: "workDetail",
        },
      },
      {
        $unwind: {
          path: "$workDetail",
        },
      },
    ]);

    const workData = {
      name: work[0].name,
      cctp_text: work[0].cctp_text,
      btu_text: work[0].btu_text,
      ranking: req.body.workRanking,
      unit: req.body.workUnit,
      unit_price: req.body.workUnitPrice,
      quantity: req.body.workQuantity,
      work_details: {
        name: work[0].workDetail.name,
        ranking: req.body.workDetailRanking,
        unit: req.body.workDetailUnit,
        unit_price: req.body.workDetailUnitPrice,
        quantity: req.body.workDetailQuantity,
      },
    };

    const project = await Projects.findByIdAndUpdate(
      req.params.projectId,
      { $push: { works: workData } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Work added to project",
      project,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
