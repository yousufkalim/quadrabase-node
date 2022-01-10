const Projects = require("../models/Projects");
const Architects = require("../models/Architects");
const WorkDetails = require("../models/WorkDetails");
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
 * Get all Projects by architectId
 * @param {object} req
 * @param {object} res
 */
exports.getByArchitect = async (req, res) => {
  try {
    const project = await Projects.find({
      architect: req.params.architectId,
    }).populate("vat"); // Finding all the Project from db
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
    const project = await Projects.findById(projectId).populate("vat"); // Finding project by id
    res.json({ success: true, project }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWorks = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Getting projectId from URL parameter
    const works = await Projects.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $unwind: {
          path: "$works",
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "works.unit",
          foreignField: "_id",
          as: "work_unit",
        },
      },
      {
        $unwind: {
          path: "$work_unit",
        },
      },
      {
        $lookup: {
          from: "workdetails",
          localField: "works.work_details",
          foreignField: "_id",
          as: "work_details",
        },
      },
      {
        $unwind: {
          path: "$work_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "work_details.unit",
          foreignField: "_id",
          as: "work_details_unit",
        },
      },
      {
        $unwind: {
          path: "$work_details_unit",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          work: "$works",
          workUnit: "$work_unit",
          workDetails: "$work_details",
          workDetailsUnit: "$work_details_unit",
        },
      },
    ]); // Finding works project by id
    res.json({ success: true, works }); // Success
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
    if (req.body.work_details) {
      const work_details = await WorkDetails.find({
        _id: { $in: req.body.work_details },
      });
      let temp = [];
      work_details.map((item) => {
        let data = {
          name: item.name,
          unit: item.unit,
          unit_price: item.unit_price,
          quantity: 1,
        };
        temp.push(data);
        req.body.work_details = temp;
      });
    }
    const project = await Projects.findByIdAndUpdate(
      req.params.projectId,
      { $push: { works: req.body } },
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
