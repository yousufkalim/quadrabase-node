const mongoose = require("mongoose");

// Schema
const familiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    ranking: {
      type: Number,
      required: true,
      default: 0,
    },

    book_libraries: [
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
