const mongoose = require("mongoose");

// Schema
const TranchesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ranking: {
      type: Number,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Tranches", TranchesSchema);
