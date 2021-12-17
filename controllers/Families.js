const BookLibraries = require("../models/BookLibraries");
const Families = require("../models/Families");

//family create
exports.create = async (req, res) => {
  try {
    let name = req.body.name; //name
    const existingfamily = await Families.findOne({ name }); // Finding already existing family
    if (existingfamily) {
      // If we found existing family in db
      return res
        .status(404)
        .json({ success: false, message: "Family already exists" });
    }

    // Creating family
    const family = await Families.create(req.body); // Adding family in db
    const families = await Families.find().sort([["createdAt", -1]]);
    // Done
    res.json({ message: "Family created successfully", families }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all Families
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const families = await Families.find().sort([["createdAt", -1]]); // Finding all the Families from db
    res.json({ success: true, families }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get family by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const familyId = req.params.familyId; // Getting family id from URL parameter
    const family = await Families.findById(familyId); // Finding family by id
    res.json({ success: true, family }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update family
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const familyId = req.params.familyId; // Getting family id from URL parameter

    const family = await Families.findByIdAndUpdate(familyId, req.body, {
      new: true,
    }); // Updating the family

    const families = await Families.find().sort([["createdAt", -1]]); // Finding all the Families from db

    res.json({
      success: true,
      message: "Family updated successfully",
      families,
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
    const familyId = req.params.familyId; // Getting family id from URL parameter
    let familyExist = await Families.findById(familyId);
    if (!familyExist) {
      return res.status(404).json({ message: "Family  not found" });
    } // double check if family id is invalid
    const family = await Families.findByIdAndDelete(familyId); // Deleting the family
    await BookLibraries.updateMany(
      { _id: family.book_libraries },
      { $pull: { families: family._id } }
    ); // Deleting from the Families
    const families = await Families.find().sort([["createdAt", -1]]); // Finding all the Families from db

    res.json({
      success: true,
      families,
      message: "Family deleted successfully",
    }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
