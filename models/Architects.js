const mongoose = require("mongoose");

// Schema
const architectsSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: Number,
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
    establishment: {
      type: Number,
      required: true,
    },
    service: {
      type: Number,
      required: true,
    },
    client_code: {
      type: Number,
      required: true,
    },
    subscription: {
      type: {
        type: String,
      },
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
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
    chap0part2: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chap0part2",
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
