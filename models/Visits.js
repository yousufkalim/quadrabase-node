const mongoose = require("mongoose");

// Schema
const visitSchema = new mongoose.Schema(
  {
    visit_date: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("visit", visitSchema);
