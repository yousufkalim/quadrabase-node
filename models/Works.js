const mongoose = require("mongoose");

// Schema
const worksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cctp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CCTP",
      },
    ],
    ranking: {
      type: Number,
      required: true,
    },
    documents: [
      {
        type: String,
      },
    ],
    unit: { type: String },
    unit_price: { type: Number },
    quantity: { type: Number },

    providers: [
      {
        provider: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Providers",
        },
        documents: [{ type: String }],
      },
    ],
    work_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkDetails",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Works", worksSchema);
