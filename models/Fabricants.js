const mongoose = require('mongoose');

// Schema
const fabricantSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Model
module.exports = mongoose.model('Fabricants', fabricantSchema);
