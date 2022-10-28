const mongoose = require('mongoose');

// Schema
const fabricantLibrarySchema = new mongoose.Schema(
  {
    library: {
      type: String
    },
    fabricants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fabricants'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Model
module.exports = mongoose.model('FabricantLibrary', fabricantLibrarySchema);
