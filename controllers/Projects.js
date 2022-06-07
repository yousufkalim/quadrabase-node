const Projects = require("../models/Projects");
const Architects = require("../models/Architects");
const WorkDetails = require("../models/WorkDetails");
const Works = require("../models/Works");
const mongoose = require("mongoose");
const ArchitectsChap0 = require("../models/ArchitectsChap0");
const Chap0 = require("../models/Chap0");
const Chap0Level2 = require("../models/Chap0Level2");
const Trades = require("../models/Trades");
const Tranches = require("../models/Tranches");

//Projects create
exports.create = async (req, res) => {
  try {
    // creating project
    const existingProjects = await Projects.findOne({
      name: req.body.name,
      architect: req.body.architect,
    }); // Finding already existing Projects
    if (existingProjects) {
      // If we found existing Projects in db
      return res.status(401).json({ success: false, message: "Project already exists" });
    }

    const project = await Projects.create(req.body);

    let architect = await Architects.findByIdAndUpdate(req.body.architect, { $push: { projects: project._id } }, { new: true });

    if (project.market_type === "Trades") {
      // Creating Trade
      const tradeData = {
        name: "Lot n°1",
        ranking: 0,
        project: project._id,
      };
      await Trades.create(tradeData); // Adding Trade in db
    } else if (project.market_type === "TradesAndTranches") {
      // Creating Trade
      const tradeData = {
        name: "Lot n°1",
        ranking: 0,
        project: project._id,
      };
      const trade = await Trades.create(tradeData); // Adding Trade in db
      const tranchData = {
        name: "Tranche Ferme",
        ranking: 0,
        project: project._id,
        trade: trade._id,
      };
      await Tranches.create(tranchData); // Adding Trade in db
    }

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
    })
      .populate("vat")
      .populate("prescriber")
      .populate("client"); // Finding all the Project from db
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
      .populate("chap0part2.id")
      .populate("prescriber")
      .populate("client"); // Finding project by id
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
          from: "trades",
          localField: "works.trade",
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
          from: "trades",
          localField: "works.trade",
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
      const chap0Level2 = await Chap0Level2.aggregate([
        {
          $match: {
            parentLevel: mongoose.Types.ObjectId(chap0._id),
          },
        },
        {
          $lookup: {
            from: "chap0level3",
            localField: "_id",
            foreignField: "parentLevel",
            as: "level3",
          },
        },
      ]);
      const architectsChap0 = await ArchitectsChap0.create({
        title: chap0.title,
        text: chap0.text,
        architect: req.userId,
        level2: chap0Level2,
      });

      await Architects.findByIdAndUpdate(req.body.architect, { $push: { chap0part2: architectsChap0._id } }, { new: true });
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
        item1.cctp_text = req.body.cctp_text;
        item1.bpu_text = req.body.bpu_text;
      }
      return item1;
    });
    project.save();

    res.json({
      success: true,
      message: "Work updated Successfully",
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
      message: "Work Detail updated Successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWorkRanking = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workId = req.body.workId;
    let project = await Projects.findById(projectId);

    project.works.map((item1) => {
      if (item1._id == workId) {
        item1.ranking = req.body.ranking;
      }
      return item1;
    });
    project.save();

    res.json({
      success: true,
      message: "Ranking updated successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateWorkDetailRanking = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workDetailId = req.body.workDetailId;
    let project = await Projects.findById(projectId);

    project.works.map((item1) => {
      item1.work_details.map((item2) => {
        if (item2._id == workDetailId) {
          item2.renking = req.body.ranking;
        }
        return item2;
      });
      return item1;
    });
    project.save();

    res.json({
      success: true,
      message: "Ranking updated successfully",
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

    let architect = await Architects.findByIdAndUpdate(project.architect, { $pull: { projects: projectId } }, { new: true });

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
    await Projects.findByIdAndUpdate(projectId, { $pull: { works: { _id: workId } } }, { new: true });
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
      await Projects.findByIdAndUpdate(projectId, { $pull: { works: { _id: workId } } }, { new: true });
    }

    res.json({
      success: true,
      message: "WorkDetail deleted successfully",
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

    const project = await Projects.findByIdAndUpdate(req.params.projectId, { $push: { works: req.body } }, { new: true });
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

//duplicate work
exports.duplicateWork = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workId = req.body.workId;
    let project = await Projects.findById(projectId);

    let work = {};
    let maxRanking = Math.max.apply(
      Math,
      project.works.map((item) => {
        return item.ranking;
      })
    );
    project.works.map((item1) => {
      if (item1._id == workId) {
        work.name = item1.name;
        work.cctp_text = item1.cctp_text;
        work.bpu_text = item1.bpu_text;
        work.ranking = maxRanking >= 0 ? maxRanking + 1 : 0;
        if (item1.unit) {
          work.unit = item1.unit;
        }
        if (item1.unit_price) {
          work.unit_price = item1.unit_price;
        }
        if (item1.quantity) {
          work.quantity = item1.quantity;
        }
        if (item1.tranch) {
          work.tranch = item1.tranch;
        }
        if (item1.trade) {
          work.trade = item1.trade;
        }
        work.work_details = [];
        item1.work_details.map((item2) => {
          let tempObj = {
            name: item2.name,
            unit: item2.unit,
            unit_price: item2.unit_price,
            quantity: item2.quantity,
            ranking: item2.ranking,
          };
          work.work_details.push(tempObj);
        });
      }
    });
    project.works.push(work);
    await project.save();

    res.json({
      success: true,
      message: "Duplicate work created",
      work,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//duplicate work detail
exports.duplicateWorkDetail = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const workId = req.body.workId;
    const workDetailId = req.body.workDetailId;
    let project = await Projects.findById(projectId);

    let workDetail = {};
    project.works.map((item1) => {
      if (item1._id == workId) {
        let maxRanking = Math.max.apply(
          Math,
          item1.work_details.map((item) => {
            return item.ranking;
          })
        );
        item1.work_details.map((item2) => {
          if (item2._id == workDetailId) {
            workDetail.name = item2.name;
            workDetail.unit = item2.unit;
            workDetail.unit_price = item2.unit_price;
            workDetail.quantity = item2.quantity;
            workDetail.ranking = maxRanking >= 0 ? maxRanking + 1 : 0;
          }
        });
        item1.work_details.push(workDetail);
        return item1;
      }
    });
    await project.save();

    res.json({
      success: true,
      message: "Duplicate work Detail created",
      project,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
