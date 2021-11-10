const mongoose = require("mongoose");

// Schema
const workDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    ranking: {
      type: Number,
      required: true,
    },

    unit: { type: String },
    unit_price: { type: Number },
    quantity: { type: Number },

    providers: [
      {
        provider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Providers",
        },
        documents: [{ type: String }],
      },
    ],
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
