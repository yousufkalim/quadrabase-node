const mongoose = require("mongoose");

// Schema
const TradesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ranking: {
      type: Number,
      required: true,
      default: 0,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Trades", TradesSchema);
