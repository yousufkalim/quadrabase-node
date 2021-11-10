const mongoose = require("mongoose");

// Schema
const bookLibrariesSchema = new mongoose.Schema(
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

    families: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Families",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("BookLibraries", bookLibrariesSchema);
