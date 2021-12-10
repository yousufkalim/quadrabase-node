const mongoose = require("mongoose");

// Schema
const subscriptionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    duration: {
      type: Number, ////Number of months
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Subscriptions", subscriptionsSchema);
