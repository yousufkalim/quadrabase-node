const mongoose = require('mongoose');

// Schema
const fabricantSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    url: {
      type: String
    },
    ranking: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Model
module.exports = mongoose.model('Fabricants', fabricantSchema);
