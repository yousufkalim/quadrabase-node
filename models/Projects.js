const mongoose = require("mongoose");

// Schema
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
    work: {
      name: { type: String },
      cctp_text: [String],
      btu_text: [String],
      ranking: { type: Number },
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
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Projects", projectsSchema);
