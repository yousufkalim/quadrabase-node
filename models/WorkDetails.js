const mongoose = require("mongoose");

// Schema
const workDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ranking: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },
    unit_price: { type: Number, default: 0 },

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
