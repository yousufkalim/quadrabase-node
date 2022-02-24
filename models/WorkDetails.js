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
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },
    unit_price: { type: mongoose.Types.Decimal128, default: 0.00 },
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
