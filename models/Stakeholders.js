const mongoose = require("mongoose");

// Schema
const stakeholdersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: false,
    },
    entity: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: false,
    },
    address1: {
      type: String,
      required: false,
    },
    address2: {
      type: String,
      required: false,
    },
    zipcode: {
      type: Number,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Stakeholders", stakeholdersSchema);
