const mongoose = require("mongoose");

// Schema
const stakeholdersSchema = new mongoose.Schema(
  {
    email: {
      type: String,

      // unique: true,
      // lowercase: true,
    },
    name: {
      type: String,
    },
    ranking: {
      type: Number,
    },
    contact_no: {
      type: String,
    },
    entity: {
      type: String,
    },
    service: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    city: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StakeholderTypes",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Stakeholders", stakeholdersSchema);
