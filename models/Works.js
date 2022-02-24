const mongoose = require("mongoose");

// Schema
const worksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    cctp_text: [
      {
        type: String,
      },
    ],
    bpu_text: [
      {
        type: String,
      },
    ],
    ranking: {
      type: Number,
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },
    unit_price: { type: mongoose.Types.Decimal128, default: 0.00 },
    providers: [
      {
        provider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Providers",
        },
        documents: [{ uri: String }],
      },
    ],
    work_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkDetails",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Works", worksSchema);
