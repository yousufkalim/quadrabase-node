const mongoose = require("mongoose");

// Schema
const architectsSchema = new mongoose.Schema(
  {
    address_1: String,
    address_2: String,
    po_box: Number,
    postal_code: Number,
    city: String,
    phone: String,
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    profile_pic: String,
    establishment: String,
    service: String,
    client_code: String,
    authorized: {
      type: String,
      default: "Yes",
    },
    subscriptions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Licenses",
    },
    myLicenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Licenses",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects",
      },
    ],
    stakeholders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stakeholders",
      },
    ],
    chap0part2: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArchitectsChap0",
      },
    ],
    libraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookLibraries",
      },
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Architects", architectsSchema);
