const mongoose = require('mongoose');

// Schema
const providersSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    name: { type: String },
    email: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
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
        ref: 'Works',
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
      type: String,
    },
    logo: {
      type: String,
    },
    url: {
      type: String,
    },
    po_box: {
      type: String,
    },
    email_address_client: {
      type: String,
    },
    client_code: {
      type: String,
    },
    establishment: {
      type: String,
    },
    subscription: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscriptions',
      },
      name: {
        type: String,
      },
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
    },
    authorized: {
      type: String,
      default: 'No',
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('Providers', providersSchema);
