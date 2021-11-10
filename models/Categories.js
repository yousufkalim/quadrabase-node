const mongoose = require("mongoose");

// Schema
const categoriesSchema = new mongoose.Schema(
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

    book_library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookLibraries",
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Works",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Categories", categoriesSchema);
