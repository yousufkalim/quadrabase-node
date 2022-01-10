const mongoose = require("mongoose");

// Schema
const vatSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
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
module.exports = mongoose.model("VAT", vatSchema);
