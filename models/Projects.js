const mongoose = require("mongoose");

// Schema
const projectsSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stakeholders",
      required: true,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
      required: true,
    },
    prescriber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    vat: {
      type: String,
      required: true,
    },
    market_type: {
      type: String,
      required: true,
    },
    structure: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    chapter: {
      type: String,
      required: false,
    },
    trades: {
      type: String,
      required: false,
    },
    tranche: {
      type: String,
      required: false,
    },
    Chapspart2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapspart2",
    },
    stakeholders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stakeholders",
      },
    ],
    work: {
      name: { type: String },
      cctp: {
        name: { type: String },
        type: { type: String },
        ranking: { type: String },
      },
      ranking: { type: Number },
      documents: [{ type: String }],
      unit: { type: String },
      unit_price: { type: Number },
      quantity: { type: Number },
    },
    work_details: {
      name: { type: String },
      ranking: { type: Number },
      unit: { type: String },
      unit_price: { type: Number },
      quantity: { type: Number },
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "archived"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Projects", projectsSchema);
