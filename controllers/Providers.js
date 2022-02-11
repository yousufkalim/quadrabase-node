const Providers = require("../models/Providers");
const Works = require("../models/Works");
const moment = require("moment");

//provider create
exports.create = async (req, res) => {
  try {
    let email = req.body.email; //email
    const existingProvider = await Providers.findOne({ email }); // Finding already existing provider
    if (existingProvider) {
      // If we found existing provider in db
      return res
        .status(404)
        .json({ success: false, message: "Provider already exists" });
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
    const providers = await Providers.find()
      .sort([["createdAt", -1]])
      .populate("works"); // Finding all the Providers from db
    res.json({ success: true, providers }); // Success
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

    const provider = await Providers.findByIdAndUpdate(providerId, req.body, {
      new: true,
    }); // Updating the provider
    res.json({
      success: true,
      message: "Provider updated successfully",
      provider,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addSubscription = async (req, res) => {
  if (!req.body.name) {
    await Providers.findByIdAndUpdate(req.params.providerId, {
      subscription: {},
    });
    res.json({ success: true, message: "Subscription Removed!" });
  } else {
    const data = {
      name: req.body.name,
      start_date: moment(req.body.start_date)
        .add(1, "days")
        .format("YYYY/MM/DD"),
      end_date: moment(req.body.end_date).add(1, "days").format("YYYY/MM/DD"),
    };
    console.log("providerId", req.params.providerId);

    await Providers.findByIdAndUpdate(req.params.providerId, {
      subscription: data,
    });
    res.json({ success: true, message: "Subscription Updated!" });
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
    await Works.updateMany(
      { _id: provider.providers },
      { $pull: { providers: providerId } }
    ); // Deleting from the Architects
    res.json({
      success: true,
      message: "Provider deleted successfully",
      provider,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all works attached to Provider by it's id
 * @param {object} req
 * @param {object} res
 */
exports.getWorksByProviderId = async (req, res) => {
  try {
    const providerId = req.params.providerId; // Getting provider id from URL parameter
    const populateQuery = [
      {
        path: "providers",
        populate: [
          {
            path: "provider",
          },
        ],
      },
    ];
    let works = await Works.find({
      "providers.provider": providerId,
    }).populate(populateQuery);
    console.log(works, "works");
    res.json({ success: true, works }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
