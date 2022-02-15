const mongoose = require("mongoose");

// Schema
const vatSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
    },
    symbol: {
      type: String,
      default: "%",
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
module.exports = mongoose.model("VAT", vatSchema);
