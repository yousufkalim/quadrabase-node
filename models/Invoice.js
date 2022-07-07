const mongoose = require('mongoose');

// Schema
const InvoiceSchema = new mongoose.Schema(
  {
    Facture: {
      type: String,
    },
    date: {
      type: Date,
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
        count: Number,
      },
    ],
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
