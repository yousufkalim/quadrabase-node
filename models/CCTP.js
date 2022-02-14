const mongoose = require("mongoose");

// Schema
const cctpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    ranking: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("CCTP", cctpSchema);
