const Trades = require("../models/Trades");
const Projects = require("../models/Projects");

/**
 * Create trade
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let name = req.body.name; // name
    req.body.architect = req.userId;
    const existingTrade = await Trades.findOne({
      name,
      architect: req.body.architect,
    }); // Finding already existing Trade
    if (existingTrade) {
      // If we found existing trade in db
      return res
        .status(404)
        .json({ success: false, message: "Trade already exists" });
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
    const trades = await Trades.find({ architect: req.userId });
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
    const inUseTrade = await Projects.findOne({ "works.trade": tradeId });
    if (inUseTrade) {
      return res.status(400).json({ success: false, message: "Trade in use" });
    }
    const trade = await Trades.findByIdAndDelete(tradeId); // Deleting the trade
    res.json({ success: true, message: "Trade deleted successfully", trade }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
