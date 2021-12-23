const Projects = require("../models/Projects");
const Architects = require("../models/Architects");

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
