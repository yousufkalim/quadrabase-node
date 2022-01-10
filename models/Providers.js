const mongoose = require("mongoose");

// Schema
const providersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,

      unique: true,
      lowercase: true,
    },

    contact_no: {
      type: String,
    },
    telephone_no: {
      type: String,
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Works",
      },
    ],
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    logo: {
      type: String,
    },
    url: {
      type: String,
    },
    po_box: {
      type: Number,
    },
    email_address_client: {
      type: String,
    },
    client_code: {
      type: String,
    },
    establishment: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("Providers", providersSchema);
