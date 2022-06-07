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
      months: Number, ////Number of months
      price: Number,
    },
    credit: {
      type: Number, ////Number of credits with this subscription
    },
    projectsPack: {
      projects: {
        type: Number,
        default: 0,
      }, ////Number of projects with this subscription
      price: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Subscriptions", subscriptionsSchema);
