const Subscriptions = require("../models/Subscriptions");

//subscription create
exports.create = async (req, res) => {
  try {
    let reference = req.body.reference; //name
    const existingSubscription = await Subscriptions.findOne({ reference: reference }); // Finding already existing subscription
    if (existingSubscription) {
      // If we found existing subscription in db
      return res.status(404).json({ success: false, message: "La référence existe déjà" });
    }
    // Creating subscription
    req.body.code = Math.floor(Math.random() * 90000) + 10000;
    const subscription = await Subscriptions.create(req.body); // Adding subscription in db

    // Done
    res.json({ message: "Subscription created successfully", subscription }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Subscriptions
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const subscription = await Subscriptions.find().sort([["createdAt", -1]]); // Finding all the Subscriptions from db
    res.json({ success: true, subscription }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get subscription by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const subscriptionId = req.params.subscriptionId; // Getting subscription id from URL parameter
    const subscription = await Subscriptions.findById(subscriptionId); // Finding subscription by id
    res.json({ success: true, subscription }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update subscription
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const subscriptionId = req.params.subscriptionId; // Getting subscription id from URL parameter
    const subscription = await Subscriptions.findByIdAndUpdate(subscriptionId, req.body, {
      new: true,
    }); // Updating the subscription
    res.json({
      success: true,
      message: "Subscription updated successfully",
      subscription,
    }); // Success
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
    const subscriptionId = req.params.subscriptionId; // Getting subscription id from URL parameter
    const subscription = await Subscriptions.findByIdAndDelete(subscriptionId); // Deleting the subscription
    res.json({ success: true, message: "Subscription deleted successfully", subscription }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
