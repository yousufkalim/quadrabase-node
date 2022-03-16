const mongoose = require("mongoose");

// Schema
const InvoiceSchema = new mongoose.Schema(
  {
    Facture: {
      type: String,
    },
    date: {
      type: Date,
    },
    DESTINATAIRE: {
      type: String,
    },
    // for architect
    initialprice: {
      type: Number,
    },
    initialCount: {
      type: Number,
    },
    initialTotal: {
      type: Number,
    },
    reprice: {
      type: Number,
    },
    reCount: {
      type: Number,
    },
    reTotal: {
      type: Number,
    },
    packprice: {
      type: Number,
    },
    packCount: {
      type: Number,
    },
    packTotal: {
      type: Number,
    },
    projects: {
      type: Number,
    },
    // for provider
    alertPrice: {
      type: Number,
    },
    alertCount: {
      type: Number,
    },
    alertTotal: {
      type: Number,
    },
    referenPrice: {
      type: Number,
    },
    referenCount: {
      type: Number,
    },
    referenTotal: {
      type: Number,
    },
    totalHT: {
      type: Number,
    },
    tvaPercentage: {
      type: Number,
    },
    tvaAmount: {
      type: Number,
    },
    totalTTC: {
      type: Number,
    },
    paymentMode: {
      type: String,
    },
    invoiceCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Invoice", InvoiceSchema);
