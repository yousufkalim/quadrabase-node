const mongoose = require('mongoose');

// Schema
const staticPagesSchema = new mongoose.Schema(
  {
    cgu: {
      type: String
    },
    cgv: {
      type: String
    },
    mentionLegal: {
      type: String
    },
    privacy: {
      type: String
    },
    product: {
      type: String
    },
    supports: [
      {
        title: String,
        text: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Model
module.exports = mongoose.model('StaticPages', staticPagesSchema);
