const mongoose = require("mongoose");

// Schema
const chapsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Chaps", chapsSchema);
