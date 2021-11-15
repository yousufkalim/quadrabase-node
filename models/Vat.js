const mongoose = require("mongoose");

// Schema
const vatSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
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
module.exports = mongoose.model("VAT", vatSchema);
