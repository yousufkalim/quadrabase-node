const mongoose = require("mongoose");

// Schema
const subscriptionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Prescribers", "Manufacturers"],
    },
    duration: {
      type: Number, ////Number of months
    },
    projects: {
      type: Number, ////Number of months
    },
    price: {
      type: Number, ////Number of credits with this subscription
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Subscriptions", subscriptionsSchema);
