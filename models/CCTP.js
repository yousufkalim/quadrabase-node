const mongoose = require("mongoose");

// Schema
const cctpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    ranking: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("CCTP", cctpSchema);
