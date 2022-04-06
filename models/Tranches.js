const mongoose = require("mongoose");

// Schema
const TranchesSchema = new mongoose.Schema(
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
    trade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trades",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Tranches", TranchesSchema);
