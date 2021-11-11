const Providers = require("../models/Providers");

//provider create
exports.create = async (req, res) => {
  try {
    let email = req.body.email; //email
    const existingProvider = await Providers.findOne({ email }); // Finding already existing provider
    if (existingProvider) {
      // If we found existing provider in db
      return res
        .status(404)
        .json({ success: false, message: "Provider already exists." });
    }
    if (req.file) {
      req.body.logo = req.file.path;
    }

    // Creating provider
    const provider = await Providers.create(req.body); // Adding provider in db

    // Done
    res.json({ message: "Provider created successfully", provider }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Providers
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const Providers = await Providers.find(); // Finding all the Providers from db
    res.json({ success: true, Providers }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get provider by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const provider = await Providers.findById(providerId); // Finding provider by id
    res.json({ success: true, provider }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update provider
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    if (req.file) {
      req.body.logo = req.file.path;
    }
    const provider = await Providers.findByIdAndUpdate(providerId, req.body, {
      new: true,
    }); // Updating the provider
    res.json({ success: true, provider }); // Success
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
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const provider = await Providers.findByIdAndDelete(providerId); // Deleting the provider
    res.json({ success: true, provider }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
