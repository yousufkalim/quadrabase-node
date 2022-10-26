const router = require('express').Router();
const Fabricants = require('../controllers/Fabricants');
const Auth = require('../middleware/auth');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Fabricants signup
 * @method get get all Fabricants

 * @method put update Fabricants
 * @method delete delete Fabricants
 */

// create - Fabricants Signup
router.post('/create', Auth(), Fabricants.create);

router.post('/addFabricant', Auth(), Fabricants.addFabricant);

router.put(
  '/update/editFabricant/:fabricantId',

  Auth(),
  Fabricants.editFabricant
);

// Read
router.get('/', Fabricants.getFabricants); // Get all Fabricants at once

// Update
router.put('/:FabricantsId', Auth(), Fabricants.update); // Update a specific Fabricants by it's id

// delete support
router.delete('/FabricantsId', Auth(), Fabricants.deleteFabricants); // Update a specific Fabricants by it's id

// Export
module.exports = router;
