const Fabricants = require('../models/Fabricants');
const FabricantLibrary = require('../models/FabLibrary');

//Fabricants create
exports.create = async (req, res) => {
  try {
    // Creating Fabricants
    const fabricantLibrary = await FabricantLibrary.create(req.body); // Adding Fabricants in db

    // Done
    res.json({ message: 'Fabricants created successfully', fabricantLibrary }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.addFabricant = async (req, res) => {
  try {
    const FabricantLibraryId = req.body.libraryId; // Getting FabricantLibrary id from URL parameter

    let FabricantLibrary = await FabricantLibrary.findById({ _id: FabricantLibraryId });
    if (!FabricantLibrary) {
      return res.status(404).json({ message: 'FabricantLibrary id not found' });
    } // double check if FabricantLibrary id is invalid
    let fabricants = await Fabricants.create(req.body);
    const fabricantId = fabricants._id;
    FabricantLibrary = await FabricantLibrary.findByIdAndUpdate(
      FabricantLibraryId,
      { $push: { fabricants: fabricantId } },
      {
        new: true
      }
    ); // Updating the BookLibrary

    res.json({
      success: true,
      message: 'fabricant added Successfully',
      category
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.editFabricant = async (req, res) => {
  try {
    const fabricantId = req.params.fabricantId; // Getting fabricantId id from URL parameter
    let fabricantExist = await Fabricants.findById({ _id: fabricantId });
    if (!fabricantExist) {
      return res.status(404).json({ message: 'fabricant id not found' });
    } // double check if Fabricant id exists
    let Fabricant = await Fabricants.findByIdAndUpdate(
      fabricantId,
      { $set: req.body },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: 'Fabricant updated Successfully',
      Fabricant
    }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Fabricants
 * @param {object} req
 * @param {object} res
 */
exports.getFabricantsLibrary = async (req, res) => {
  try {
    const fabricants = await FabricantLibrary.find(); // Finding all the Fabricants from db
    res.json({ success: true, data: fabricants }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFabricants = async (req, res) => {
  try {
    const fabricantId = req.params.fabricantId;

    const fabricant = await FabricantLibrary.findById(fabricantId).populate('fabricants');

    res.json({ success: true, bookLibraries }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update Fabricants
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const fabricantId = req.params.FabricantsId;
    const fabricants = await Fabricants.findByIdAndUpdate(fabricantId, req.body, { new: true }); // Finding all the Fabricants from db
    res.json({ success: true, message: 'Updated successfully', data: fabricants }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Fabricants
 * @param {object} req
 * @param {object} res
 */
exports.deleteFabricants = async (req, res) => {
  try {
    const fabricantId = req.params.FabricantIdId;
    const fabricants = await fabricants.findByIdAndDelete(fabricants); // Deleting the fabricants
    res.json({ success: true, message: 'Deleted successfully' }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
