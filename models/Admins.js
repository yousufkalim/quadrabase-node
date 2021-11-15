const mongoose = require("mongoose");

// Schema
const adminsSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profile_pic: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Admins", adminsSchema);
