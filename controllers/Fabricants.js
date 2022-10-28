const Fabricants = require('../models/Fabricants');
const FabricantLibrary = require('../models/FabLibrary');

//Fabricants create
exports.create = async (req, res) => {
  try {
    // Creating Fabricants
    console.log('req.body ', req.body);
    const fabricantLibrary = await FabricantLibrary.create(req.body); // Adding Fabricants in db

    // Done
    res.json({ message: 'Bibliothèque fabricant ajoutée avec succès', fabricantLibrary }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.addFabricant = async (req, res) => {
  try {
    console.log('req.body', req.body);
    let FabricantLibraryId = req.body.libraryId; // Getting FabricantLibrary id from URL parameter

    let fabricantLibrary = await FabricantLibrary.findById({ _id: FabricantLibraryId });
    console.log('FabricantLibrary', fabricantLibrary);
    if (!fabricantLibrary) {
      return res.status(404).json({ message: 'FabricantLibrary id not found' });
    } // double check if FabricantLibrary id is invalid
    let fabricants = await Fabricants.create(req.body);
    let fabricantId = fabricants._id;
    fabricantLibrary = await FabricantLibrary.findByIdAndUpdate(
      FabricantLibraryId,
      { $push: { fabricants: fabricantId } },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: 'Fabricant ajouté avec succès'
      // FabricantLibrary
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
      message: 'Fabricant mis à jour avec succès',
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
    // const fabricants = await FabricantLibrary.find().populate('fabricants'); // Finding all the Fabricants from db
    const fabricants = await FabricantLibrary.find().populate({
      path: 'fabricants'
      // options: { sort: { createdAt: -1 } }
    });
    res.json({ success: true, fabricants }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFabricants = async (req, res) => {
  try {
    const fabricantId = req.params.fabricantId;

    const fabricant = await FabricantLibrary.find().populate({
      path: 'fabricants',
      sort: { createdAt: -1 }
    });

    // .populate('fabricants');

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
    console.log('fabricantId1');
    const FabricantLibraryId = req.body.libraryId;
    const fabricantId = req.params.FabricantsId;
    console.log('fabricantId', fabricantId);
    console.log('FabricantLibraryId', FabricantLibraryId);
    await FabricantLibrary.findByIdAndUpdate(
      FabricantLibraryId,
      { $pull: { fabricants: fabricantId } },
      {
        new: true
      }
    );
    await Fabricants.findByIdAndDelete(fabricantId); // Deleting the fabricants
    res.json({ success: true, message: 'Supprimé avec succès' }); // Success
  } catch (err) {
    // Error handlings
    console.log('Error ----> ', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
