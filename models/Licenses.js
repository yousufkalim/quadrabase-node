const mongoose = require("mongoose");

// Schema
const LicensesSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriptions",
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    projects: {
      type: Number,
      default: 0,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Licenses", LicensesSchema);
