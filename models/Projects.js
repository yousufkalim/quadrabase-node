const mongoose = require('mongoose');

// Work Schema
const workSchema = new mongoose.Schema({
  name: { type: String },
  cctp_text: [{ type: String }],
  bpu_text: [{ type: String }],
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Units' },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  unit_price: { type: Number },
  quantity: { type: Number },
  ranking: {
    type: Number,
    required: true,
    default: 0,
  },
  tranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Tranches' },
  trade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trades',
  },
  providers: [
    {
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Providers',
      },
      documents: [{ uri: String }],
    },
  ],
  work_details: [
    {
      name: { type: String },
      unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Units' },
      unit_price: { type: Number },
      quantity: { type: Number },
      ranking: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

// Project Schema
const projectsSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stakeholders',
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Architects',
    },
    prescriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stakeholders',
    },
    name: {
      type: String,
    },
    vat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VAT',
    },
    market_type: {
      type: String,
      enum: ['Simple', 'Trades', 'TradesAndTranches', 'PurchaseOrder'],
    },
    structure: {
      type: String,
      enum: ['DQEAndBPU', 'DPGF'],
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
    chap0part2: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ArchitectsChap0',
        },
        status: {
          type: String,
          enum: ['selected', 'modified'],
        },
      },
    ],
    stakeholders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stakeholders',
      },
    ],
    works: [workSchema],
    status: {
      type: String,
      enum: ['En cours', 'Complété', 'Archivé'],
      default: 'En cours',
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('Projects', projectsSchema);
