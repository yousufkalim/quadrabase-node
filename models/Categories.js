const mongoose = require("mongoose");

// Schema
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    cctp_text: [
      {
        type: String,
      },
    ],
    ranking: {
      type: Number,
      required: true,
      default: 0,
    },
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
