const mongoose = require("mongoose");

// Schema
const bookLibrariesSchema = new mongoose.Schema(
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
