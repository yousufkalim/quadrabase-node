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
    credit: {
      type: Number, ////Number of credits with this subscription
    },
    projects: {
      type: Number, ////Number of projects with this subscription
      default: 0
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
