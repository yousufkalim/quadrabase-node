const Projects = require("../models/Projects");
const Architects = require("../models/Architects");
const WorkDetails = require("../models/WorkDetails");
const Works = require("../models/Works");
const mongoose = require("mongoose");
const ArchitectsChap0 = require("../models/ArchitectsChap0");
const Chap0 = require("../models/Chap0");

//Projects create
exports.create = async (req, res) => {
  try {
    const existingProjects = await Projects.findOne({
      name: req.body.name,
      architect: req.body.architect,
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
    const project = await Projects.findById(projectId)
      .populate("vat")
      .populate("chap0part2.id"); // Finding project by id
    res.json({ success: true, project }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// works
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$works.work_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "works.work_details.unit",
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
          workDetails: "$works.work_details",
          workDetailsUnit: "$work_details_unit",
        },
      },
      {
        $unset: ["work.work_details"],
      },
    ]); // Finding works project by id
    res.json({ success: true, works }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// works by trades
exports.getWorksByTrades = async (req, res) => {
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
          from: "categories",
          localField: "works.category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "booklibraries",
          localField: "category.book_library",
          foreignField: "_id",
          as: "trade",
        },
      },
      {
        $unwind: {
          path: "$trade",
          preserveNullAndEmptyArrays: true,
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$works.work_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "works.work_details.unit",
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
          workDetails: "$works.work_details",
          workDetailsUnit: "$work_details_unit",
          category: "$category",
          trade: "$trade",
        },
      },
      {
        $unset: ["work.work_details"],
      },
      {
        $group: {
          _id: "$trade.name",
          ranking: { $first: "$trade.ranking" },
          data: {
            $push: "$$ROOT",
          },
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

// works by tranches
exports.getWorksByTranches = async (req, res) => {
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
          from: "categories",
          localField: "works.category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "booklibraries",
          localField: "category.book_library",
          foreignField: "_id",
          as: "trade",
        },
      },
      {
        $unwind: {
          path: "$trade",
          preserveNullAndEmptyArrays: true,
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$works.work_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "works.work_details.unit",
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
        $lookup: {
          from: "tranches",
          localField: "works.tranch",
          foreignField: "_id",
          as: "tranch",
        },
      },
      {
        $unwind: {
          path: "$tranch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          work: "$works",
          workUnit: "$work_unit",
          workDetails: "$works.work_details",
          workDetailsUnit: "$work_details_unit",
          category: "$category",
          trade: "$trade",
          tranch: "$tranch",
        },
      },
      {
        $unset: ["work.work_details"],
      },
      {
        $group: {
          _id: "$trade.name",
          ranking: { $first: "$trade.ranking" },
          data: {
            $push: "$$ROOT",
          },
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
    let project = {};
    if (req.body.chap0part2 && req.body.chap0part2.status === "modified") {
      const chap0 = await Chap0.findById(req.body.chap0part2.id);

      const existingTitle = await ArchitectsChap0.findOne({
        title: chap0.title,
        architect: req.userId,
      }); // Finding already existing ArchitectsChap0
      if (existingTitle) {
        // If we found existing ArchitectsChap0 in db
        return res.status(401).json({
          success: false,
          message:
            "Seleted General Chap. 0 part 2 already exists in Architect Chap. 0 part 2",
        });
      }

      const architectsChap0 = await ArchitectsChap0.create({
        title: chap0.title,
        text: chap0.text,
        architect: req.userId,
      });

      await Architects.findByIdAndUpdate(
        req.body.architect,
        { $push: { chap0part2: architectsChap0._id } },
        { new: true }
      );
      req.body.chap0part2 = {
        id: architectsChap0._id,
        status: "modified",
      };
      project = await Projects.findByIdAndUpdate(projectId, req.body, {
        new: true,
      }); // Updating the project
    } else {
      project = await Projects.findByIdAndUpdate(projectId, req.body, {
        new: true,
      }); // Updating the project
    }

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

exports.updateWork = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workId = req.body.workId;
    let project = await Projects.findById(projectId);

    project.works.map((item1) => {
      if (item1._id == workId) {
        item1.name = req.body.name;
        item1.unit = req.body.unit;
        item1.unit_price = req.body.unit_price;
        item1.quantity = req.body.quantity;
      }
      return item1;
    });
    project.save();

    res.json({
      success: true,
      message: "Work updated successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWorkDetail = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workDetailId = req.body.workDetailId;
    let project = await Projects.findById(projectId);

    project.works.map((item1) => {
      item1.work_details.map((item2) => {
        if (item2._id == workDetailId) {
          item2.name = req.body.name;
          item2.unit = req.body.unit;
          item2.unit_price = req.body.unit_price;
          item2.quantity = req.body.quantity;
          console.log(item2);
        }
        return item2;
      });
      return item1;
    });
    project.save();

    res.json({
      success: true,
      message: "Work detail updated successfully",
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

// delete work from project
exports.deleteWork = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workId = req.body.workId;
    await Projects.findByIdAndUpdate(
      projectId,
      { $pull: { works: { _id: workId } } },
      { new: true }
    );
    res.json({
      success: true,
      message: "Work deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete work from project
exports.deleteWorkDetail = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workDetailId = req.body.workDetailId;
    let project = await Projects.findById(projectId);

    let workId = "";
    project.works.map((item1) => {
      item1.work_details.pull({ _id: workDetailId });
      if (item1.work_details.length < 1 && !item1.unit) {
        workId = item1._id;
      }
      return item1;
    });
    project.save();
    if (workId) {
      await Projects.findByIdAndUpdate(
        projectId,
        { $pull: { works: { _id: workId } } },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: "Work detail deleted successfully",
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
          ranking: item.ranking,
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
