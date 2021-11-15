const mongoose = require("mongoose");

// Schema
const familiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ranking: {
      type: Number,
      required: true,
    },

    book_library: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookLibraries",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Families", familiesSchema);
