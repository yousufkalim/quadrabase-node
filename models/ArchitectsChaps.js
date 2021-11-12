const mongoose = require("mongoose");

// Schema
const architectChap0Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("ArchitectsChap0", architectChap0Schema);
