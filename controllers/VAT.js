const VAT = require("../models/Vat");

//VAT create
exports.create = async (req, res) => {
  try {
    let value = req.body.value; //value
    let ranking = req.body.ranking; //ranking

    const existingVAT = await VAT.findOne({
      $and: [{ value: value }, { ranking: ranking }],
    }); // Finding already existing VAT
    if (existingVAT) {
      // If we found existing VAT in db
      return res
        .status(404)
        .json({ success: false, message: "VAT already exists." });
    }

    // Creating VAT
    const vat = await VAT.create(req.body); // Adding VAT in db

    // Done
    res.json({ message: "VAT created successfully", vat }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all VAT
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const vat = await VAT.find(); // Finding all the VAT from db
    res.json({ success: true, vat }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get VAT by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const VATId = req.params.VATId; // Getting VAT id from URL parameter
    const vat = await VAT.findById(VATId); // Finding VAT by id
    res.json({ success: true, vat }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update VAT
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const VATId = req.params.VATId; // Getting VAT id from URL parameter

    const vat = await VAT.findByIdAndUpdate(VATId, req.body, {
      new: true,
    }); // Updating the VAT
    res.json({ success: true, message: "VAT updated successfully", vat }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const VATId = req.params.VATId; // Getting VAT id from URL parameter
    const vat = await VAT.findByIdAndDelete(VATId); // Deleting the VAT
    res.json({ success: true, vat }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
