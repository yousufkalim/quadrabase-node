const mongoose = require("mongoose");

// Schema
const StakeholderTypesSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    ranking: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("StakeholderTypes", StakeholderTypesSchema);
