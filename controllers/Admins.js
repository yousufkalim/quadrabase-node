const Admins = require("../models/Admins");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const JWT = require("jsonwebtoken");

//admin register
exports.register = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing admin
    if (existingAdmin) {
      // If we found existing user in db
      return res
        .status(401)
        .json({ success: false, message: "Admin already exists." });
    }

    // Getting url of the image
    if (req.file) {
      req.body.profile_pic = req.file.path; // Creating a new property called profile_pic in body object
    }

    // Creating Admin
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt bcryptSalt
    const user = await Admins.create(req.body); // Adding admin in db

    // Done
    res.json({ message: "Admin created successfully", user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

//admin login
exports.login = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password
    const user = await Admins.findOne({ email }); // Finding already existing admin
    if (!user) {
      // If we found existing user in db
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const isCorrect = bcrypt.compareSync(password, user.password); // Check if user password is correct
    if (!isCorrect)
      return res.status(404).json({ message: "Invalid Password" });
    const token = JWT.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 60,
    });
    const result = { user, token };
    // Done
    res.json({ success: true, message: "User login successfully", result }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Forgot Password
 * @param {object} req
 * @param {object} res
 */
exports.forgotPassword = async (req, res) => {
  try {
    let email = req.body.email; //email
    let user = await Admins.findOne({ email }); // Finding if admin exists
    if (!user) {
      // If we not found existing user in db
      return res
        .status(404)
        .json({ success: false, message: "Admin does not exist" });
    }
    let token = Math.floor(Math.random() * 9000) + ""; //random number token generator

    const resetPasswordExpires = Date.now() + 900000;
    let resetPasswordToken = await bcrypt.hash(token, parseInt(bcryptSalt)); // hashing token with bcryptjs
    //update admin
    user = await Admins.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetPasswordToken, //reset password token
          resetPasswordExpires: resetPasswordExpires, ///reset password token expiration
        },
      },
      { new: true }
    );
    // Done
    res.json({ message: "Email Sent successfully", user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
/**
 * Reset Password
 * @param {object} req
 * @param {object} res
 */
exports.resetPassword = async (req, res) => {
  try {
    let resetPasswordToken = req.body.resetPasswordToken; //token
    let password = req.body.password;
    let user = await Admins.findOne({ resetPasswordToken }); // Finding already existing admin
    if (!user) {
      // If we not found existing user in db
      return res
        .status(401)
        .json({ success: false, message: "Invalid Token!" });
    }
    let isExpired = Number(user.restPasswordExpires);
    if (isExpired < Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Token Expired!" });
    }
    password = bcrypt.hashSync(password, parseInt(bcryptSalt));
    user = await Admins.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: password,
        },
      },
      { new: true }
    );
    // Done
    res.json({ message: "Password Updated successfully", user }); //Success
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
    const admins = await Admins.find().sort([["createdAt", -1]]); // Finding all the admins from db
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
    const adminId = req.params.adminId; // Getting user id from URL parameter
    const admin = await Admins.findById(adminId); // Finding user by id
    res.json({ success: true, admin }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update admin
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const adminId = req.params.adminId; // Getting admin id from URL parameter
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    const user = await Admins.findByIdAndUpdate(adminId, req.body, {
      new: true,
    }); // Updating the admin
    res.json({ success: true, message: "Admin updated successfully", user }); // Success
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
    const adminId = req.params.adminId; // Getting admin id from URL parameter
    const user = await Admins.findByIdAndDelete(adminId); // Deleting the admin
    res.json({
      success: true,
      message: "Admin deleted successfully",

      user,
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
