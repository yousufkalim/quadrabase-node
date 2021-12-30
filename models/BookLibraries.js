const mongoose = require("mongoose");

// Schema
const bookLibrariesSchema = new mongoose.Schema(
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
    ranking: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },

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
