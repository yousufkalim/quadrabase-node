const Admins = require("../models/Admins");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

//admin register
exports.register = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password
    const existingUser = await Admins.findOne({ email }); // Finding already existing user
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(404)
        .json({ success: false, message: "User already exists." });
    }

    // Getting url of the image
    if (req.file) {
      req.body.profile_picture = req.file.path; // Creating a new property called photo in body object
    }

    // Creating Admin
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Admins.create(req.body); // Adding admin in db

    // Done
    res.json({ message: "User created successfully", user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all admins
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const admins = await Admins.find(); // Finding all the admins from db
    res.json({ success: true, admins }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get admin by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Admins.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Update admin
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting admin id from URL parameter
    if (req.file) {
      req.body.profile_picture = req.file.path;
    }
    const user = await Admins.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // Updating the admin
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting admin id from URL parameter
    const user = await Admins.findByIdAndDelete(userId); // Deleting the admin
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
