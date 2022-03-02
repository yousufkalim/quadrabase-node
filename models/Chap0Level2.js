const mongoose = require("mongoose");

// Schema
const Chap0level2Schema = new mongoose.Schema(
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
      ref: "Chap0",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Chap0Level2", Chap0level2Schema);
