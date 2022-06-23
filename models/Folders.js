const mongoose = require("mongoose");

// Schema
const foldersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folders",
    },
    subFolders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folders",
      },
    ],
    files: {
      videos: [{ uri: String, name: String }],
      images: [{ uri: String, name: String }],
      docx: [{ uri: String, name: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Folders", foldersSchema);
