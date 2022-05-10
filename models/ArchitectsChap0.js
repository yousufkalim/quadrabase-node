const mongoose = require("mongoose");

// Child level 2 schema
const chap0Level3 = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  ranking: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Child level 1 schema
const chap0Level2 = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  ranking: {
    type: Number,
    required: true,
    default: 0,
  },
  level3: [chap0Level3],
});

// Chap 0 Schema
const architectChap0Schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    type: {
      type: String,
      enum: ["private", "duplicate"],
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architects",
    },
    level2: [chap0Level2],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("ArchitectsChap0", architectChap0Schema);
