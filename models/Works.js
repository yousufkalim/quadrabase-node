const mongoose = require("mongoose");

// Schema
const worksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    cctp_text: [
      {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "CCTP"
      },
    ],
    btu_text: [
      {
        type: String,
      },
    ],
    ranking: {
      type: Number,
    },

    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Units" },

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
