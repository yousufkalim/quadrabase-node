const Architects = require("../models/Architects");
const ArchitectsChap0 = require("../models/ArchitectsChap0");
const Categories = require("../models/Categories");
const Works = require("../models/Works");
const Admins = require("../models/Admins");

const Projects = require("../models/Projects");
const Families = require("../models/Families");

const BookLibraries = require("../models/BookLibraries");
const WorkDetails = require("../models/WorkDetails");
const Stakeholders = require("../models/Stakeholders");

const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const JWT = require("jsonwebtoken");

//architect create
exports.create = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password

    const existingArchitect = await Architects.findOne({ email }); // Finding already existing architect
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing architect

    if (existingArchitect) {
      // If we found existing architect in db
      return res
        .status(404)
        .json({ success: false, message: "Architect already exists." });
    }
    if (existingAdmin) {
      // If we found existing admin in db
      return res
        .status(404)
        .json({ success: false, message: "Architect already exists." });
    }
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt));
    // Creating architect
    const architect = await Architects.create(req.body); // Adding architect in db

    // Done
    res.json({ message: "Architect created successfully", architect }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
//BookLibrary create
exports.createBookLibrary = async (req, res) => {
  try {
    let name = req.body.name; //book library name
    let architectId = req.user.id; //architect id

    const existingBookLibrary = await BookLibraries.findOne({ name }); // Finding already existing BookLibrary
    if (existingBookLibrary) {
      // If we found existing BookLibrary in db
      return res
        .status(404)
        .json({ success: false, message: "BookLibrary already exists." });
    }

    // Creating BookLibrary
    req.body.architect = architectId;
    const BookLibrary = await BookLibraries.create(req.body); // Adding BookLibrary in db

    await Architects.findByIdAndUpdate(
      architectId,
      { $push: { libraries: BookLibrary._id } },
      {
        new: true,
      }
    ); //update architect to push bookLibrary
    // Done
    res.json({
      message: "BookLibrary created successfully",
      BookLibrary,
    }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};
//Architect login
exports.login = async (req, res) => {
  try {
    let email = req.body.email; //email
    let password = req.body.password; //password
    const user = await Architects.findOne({ email }); // Finding already existing Architect
    if (!user) {
      // If we found existing user in db
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const isCorrect = bcrypt.compareSync(password, user.password); // Check if user password is correct
    if (!isCorrect)
      return res.status(401).json({ message: "Invalid Password" });
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    const result = { user, token };
    // Done
    res.json({ success: true, result }); //Success
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
    let user = await Architects.findOne({ email }); // Finding if Architect exists
    if (!user) {
      // If we not found existing user in db
      return res
        .status(404)
        .json({ success: false, message: "Architect does not exist" });
    }
    let token = Math.floor(Math.random() * 9000) + ""; //random number token generator

    const resetPasswordExpires = Date.now() + 900000;
    let resetPasswordToken = await bcrypt.hash(token, parseInt(bcryptSalt)); // hashing token with bcryptjs
    //update Architect
    user = await Architects.findOneAndUpdate(
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
    let user = await Architects.findOne({ resetPasswordToken }); // Finding already existing Architect
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
    user = await Architects.findOneAndUpdate(
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
 * Get all Architects
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const architects = await Architects.find().sort([["createdAt", -1]]); // Finding all the Architects from db
    res.json({ success: true, architects }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get architect by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    const architect = await Architects.findById(architectId); // Finding architect by id
    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update architect
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    if (req.file) {
      req.body.profile_pic = req.file.path;
    }
    const architect = await Architects.findByIdAndUpdate(
      architectId,
      req.body,
      {
        new: true,
      }
    ); // Updating the architect
    res.json({
      success: true,
      message: "Architect updated successfully",
      architect,
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
    const architectId = req.params.architectId; // Getting architect id from URL parameter
    let architect = await Architects.findOne({ _id: architectId }); // Finding already existing Architect
    if (!architect) {
      // If we not found existing architect in db
      return res
        .status(401)
        .json({ success: false, message: "Architect not found" });
    }

    architect = await Architects.findByIdAndDelete(architectId); // Deleting the architect

    await Stakeholders.findOneAndDelete({
      architect: architectId,
    }); // Deleting the Stakeholders

    await ArchitectsChap0.findOneAndDelete({
      architect: architectId,
    }); // Deleting the ArchitectsChap0

    await Projects.findOneAndDelete({
      architect: architectId,
    }); // Deleting from the Projects

    let bookLibraries = await BookLibraries.findOneAndDelete({
      architect: architectId,
    }); // Deleting the BookLibraries
    bookLibraries = await BookLibraries.find({});
    if (bookLibraries.length == 0) {
      return res.json({ success: true, architect }); // Success
    }
    await Families.updateMany(
      { _id: bookLibraries.families },
      { $pull: { book_libraries: bookLibraries._id } }
    ); // Deleting from the Families

    let categories = await Categories.findOneAndDelete({
      book_library: bookLibraries._id,
    }); // Deleting the Categories
    let works = await Works.findOneAndDelete({
      category: categories._id,
    }); // Deleting the Works
    await WorkDetails.findOneAndDelete({
      work: works._id,
    }); // Deleting the WorkDetails

    res.json({ success: true, architect }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
/**
 * Delete bookLibrary
 * @param {object} req
 * @param {object} res
 */
exports.deleteBookLibrary = async (req, res) => {
  try {
    const BookLibraryId = req.params.BookLibraryId; // Getting BookLibrary id from URL parameter
    let bookLibrary = await BookLibraries.findById(BookLibraryId);
    if (!bookLibrary) {
      return res.status(404).json({ message: "BookLibraries  not found" });
    } // double check if BookLibraries id is invalid
    await BookLibraries.findByIdAndDelete(BookLibraryId); // Deleting the BookLibrary
    let architectId = bookLibrary.architect;

    await Architects.findByIdAndUpdate(
      architectId,
      { $pull: { libraries: BookLibraryId } },
      {
        new: true,
      }
    ); // Deleting from the architect
    let categories = await Categories.deleteMany({
      book_library: BookLibraryId,
    }); // Deleting from the Categories in BookLibraries
    const works = await Works.deleteMany({
      category: categories._id,
    }); // Deleting the Works
    await WorkDetails.deleteMany({
      work: works._id,
    }); // Deleting the WorkDetails

    res.json({ success: true, BookLibrary: bookLibrary }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
