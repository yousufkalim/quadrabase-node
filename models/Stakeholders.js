const mongoose = require("mongoose");

// Schema
const stakeholdersSchema = new mongoose.Schema(
  {
    email: {
      type: String,

      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Stakeholders", stakeholdersSchema);
