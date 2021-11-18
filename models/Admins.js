const mongoose = require("mongoose");

// Schema
const adminsSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    profile_pic: {
      type: String,
    },
    role: {
      type: String,
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
