const mongoose = require("mongoose");

// Schema
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cctp_text: [
      {
        type: String,
      },
    ],
    ranking: {
      type: Number,
      required: false,
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
