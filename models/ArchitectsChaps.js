const mongoose = require("mongoose");

// Schema
const architectChapsSchema = new mongoose.Schema(
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
module.exports = mongoose.model("Chaps", architectChapsSchema);
