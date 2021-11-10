const mongoose = require("mongoose");

// Schema
const providersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    contact_no: {
      type: String,
      required: false,
    },
    telephone_no: {
      type: String,
      required: true,
    },

    address1: {
      type: String,
      required: false,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    zipcode: {
      type: Number,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Providers", providersSchema);
