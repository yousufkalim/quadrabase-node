const mongoose = require("mongoose");

// Schema
const ChapsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    text: {
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
module.exports = mongoose.model("Chap0", ChapsSchema);
