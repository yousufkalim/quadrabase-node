const router = require('express').Router();
const Families = require('../controllers/Families');
const Auth = require('../middleware/auth');
const ArchitectsModel = require('../models/Architects');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post family signup
 * @method get get all Families
 * @method get get family by id
 * @method put update family
 * @method delete delete family
 */

// create - family Signup
router.post('/create', Auth(), Families.create);
router.post('/architect/create', Auth(ArchitectsModel), Families.create);

// Read
router.get('/', Families.getAll); // Get all Families at once
router.get('/architect/getAll', Families.getAllByArchitect); // Get all Families at once
router.get('/:familyId', Auth(), Families.getById); // Get one family by it's id

// Update
router.put('/:familyId', Auth(), Families.update); // Update a specific family by it's id
router.put('/update/:familyId', Auth(ArchitectsModel), Families.update); // Update a specific family by it's id

// Delete
router.delete('/:familyId', Auth(), Families.delete); // delete a specific family by it's id
router.delete('/delete/:familyId', Auth(ArchitectsModel), Families.delete); // delete a specific family by it's id

// Export
module.exports = router;
