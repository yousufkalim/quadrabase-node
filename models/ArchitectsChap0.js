const mongoose = require("mongoose");

// Schema
const architectChap0Schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("ArchitectsChap0", architectChap0Schema);
