// get vist model
const Visits = require("../models/Visits");

var moment = require("moment");
/**
 * Get all Units
 * @param {object} req
 * @param {object} res
 */
exports.getVistByDays = async (req, res) => {
  try {
    const visits = await Visits.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          data: {
            $sum: 1,
          },
        },
      },
    ]);
    res.status(200).json({ success: true, visits });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getVistByMonths = async (req, res) => {
  try {
    const visits = await Visits.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          data: {
            $sum: 1,
          },
        },
      },
    ]);
    res.status(200).json({ success: true, visits });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.postVist = async (req, res) => {
  try {
    const visit = await Visits.create(req.body);
    res.json({ message: "visit created successfully", visit }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
