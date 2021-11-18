const mongoose = require("mongoose");

// Schema
const unitsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    symbol: {
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
module.exports = mongoose.model("Units", unitsSchema);
