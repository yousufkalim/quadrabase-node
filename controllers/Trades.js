const Trades = require("../models/Trades");
const Projects = require("../models/Projects");
const fr = require("../utils/frLang");
const en = require("../utils/enLang");

/**
 * Create trade
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let lang = req.headers.lang ? req.headers.lang : "fr";
    let name = req.body.name; // name
    const existingTrade = await Trades.findOne({
      name,
      project: req.body.project,
    }); // Finding already existing Trade
    if (existingTrade) {
      // If we found existing trade in db
      return res
        .status(404)
        .json({
          success: false,
          message: lang === "fr" ? fr.tradesMsg1 : en.tradesMsg1,
        });
    }

    // Creating Trade
    const trade = await Trades.create(req.body); // Adding Trade in db

    // Done
    res.json({ message: "Trade created successfully", trade }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all trades
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const trades = await Trades.find({ project: req.params.projectId });
    res.json({ success: true, trades }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update trade
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const tradeId = req.params.tradeId; // Getting tradeId from URL parameter

    const trade = await Trades.findByIdAndUpdate(tradeId, req.body, {
      new: true,
    }); // Updating the trade
    res.json({ success: true, message: "Trade updated successfully", trade }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete trade
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const tradeId = req.params.tradeId; // Getting tradeId from URL parameter
    const trade = await Trades.findByIdAndDelete(tradeId); // Deleting the trade
    res.json({ success: true, message: "Trade deleted successfully", trade }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
