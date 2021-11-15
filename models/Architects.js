const mongoose = require("mongoose");

// Schema
const architectsSchema = new mongoose.Schema(
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
    establishment: {
      type: String,
    },
    service: {
      type: String,
    },
    client_code: {
      type: String,
    },
    authorized: {
      type: Boolean,
      default: false,
    },
    subscription: {
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

    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
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
    Chapspart2: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapspart2",
      },
    ],
    libraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Libraries",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Architects", architectsSchema);
