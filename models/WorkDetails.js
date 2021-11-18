const mongoose = require("mongoose");

// Schema
const workDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ranking: {
      type: Number,
    },
    unit: { type: String },
    unit_price: { type: Number },
    quantity: { type: Number },
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("WorkDetails", workDetailsSchema);
