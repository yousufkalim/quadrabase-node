const mongoose = require("mongoose");

// Schema
const Chap0level3Schema = new mongoose.Schema(
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
    parentLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chap0Level2",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Chap0Level3", Chap0level3Schema);
