const mongoose = require("mongoose");

// Schema
const stakeholdersSchema = new mongoose.Schema(
  {
    email: {
      type: String,

      // unique: true,
      // lowercase: true,
    },
    establishment: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    ranking: {
      type: Number,
      required: true,
      default: 0,
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
      type: String,
    },
    po_box: {
      type: String,
    },
    city: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StakeholderTypes",
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Stakeholders", stakeholdersSchema);
