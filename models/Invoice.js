const mongoose = require('mongoose');

// Schema
const InvoiceSchema = new mongoose.Schema(
  {
    Facture: {
      type: String,
    },
    date: {
      type: String,
    },
    subscriptionCode: {
      type: String,
    },
    subscriptionName: {
      type: String,
    },
    DESTINATAIRE: {
      type: String,
    },
    // for architect
    subscriptionsData: [
      {
        subscription: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subscriptions',
        },
        count: String,
      },
    ],
    // for provider
    alertPrice: {
      type: String,
    },
    alertCount: {
      type: Number,
    },
    alertTotal: {
      type: String,
    },
    referenPrice: {
      type: String,
    },
    referenCount: {
      type: Number,
    },
    referenTotal: {
      type: String,
    },
    totalHT: {
      type: String,
    },
    tvaPercentage: {
      type: Number,
    },
    tvaAmount: {
      type: String,
    },
    totalTTC: {
      type: String,
    },
    paymentMode: {
      type: String,
    },
    invoiceCount: {
      type: Number,
    },
    filePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('Invoice', InvoiceSchema);
