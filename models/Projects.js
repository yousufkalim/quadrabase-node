const mongoose = require("mongoose");

// Work Schema
const workSchema = new mongoose.Schema({
  name: { type: String },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },
  unit_price: { type: Number },
  quantity: { type: Number },
  work_details: [
    {
      name: { type: String },
      unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },
      unit_price: { type: Number },
      quantity: { type: Number },
    },
  ],
});

// Project Schema
const projectsSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stakeholders",
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
    prescriber: {
      type: String,
    },
    name: {
      type: String,
    },
    vat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VAT",
    },
    market_type: {
      type: String,
      enum: ["Simple", "Trades", "TradesAndTranches", "PurchaseOrder"],
    },
    structure: {
      type: String,
      enum: ["DQEAndBPU", "DPGF"],
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
    },
    chapter: {
      type: String,
    },
    trades: {
      type: String,
    },
    tranche: {
      type: String,
    },
    chap0part2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArchitectsChap0",
    },
    stakeholders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stakeholders",
      },
    ],
    works: [workSchema],
    status: {
      type: String,
      enum: ["ongoing", "completed", "archived"],
      default: "ongoing",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Projects", projectsSchema);
