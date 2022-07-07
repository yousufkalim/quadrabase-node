const mongoose = require("mongoose");

// Schema
const staticPagesSchema = new mongoose.Schema(
  {
    terms: {
      type: String,
    },
    privacy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("StaticPages", staticPagesSchema);
