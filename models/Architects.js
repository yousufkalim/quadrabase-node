const mongoose = require("mongoose");

// Schema
const architectsSchema = new mongoose.Schema(
  {
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
    credit: { type: Number, default: 1 },
    authorized: {
      type: String,
      default: "Yes",
    },
    subscriptions: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscriptions",
      },
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
    },

    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects",
      },
    ],
    // stakeholders: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Stakeholders",
    //   },
    // ],
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
