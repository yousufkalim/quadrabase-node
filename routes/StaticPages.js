const router = require('express').Router();
const StaticPages = require('../controllers/StaticPages');
const Auth = require('../middleware/auth');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post StaticPages signup
 * @method get get all StaticPages
 * @method get get StaticPages by id
 * @method put update StaticPages
 * @method delete delete StaticPages
 */

// create - StaticPages Signup
router.post('/create', Auth(), StaticPages.create);

// Read
router.get('/', StaticPages.getStaticPages); // Get all StaticPages at once

// Update
router.put('/:StaticPageId', Auth(), StaticPages.update); // Update a specific StaticPages by it's id
router.put('/addSupport/:StaticPageId', Auth(), StaticPages.addSupport); // Update a specific StaticPages by it's id
router.put('/editSupport/:StaticPageId/:supportId', Auth(), StaticPages.editSupport); // Update a specific StaticPages by it's id

// delete support
router.delete('/deleteSupport/:StaticPageId/:supportId', Auth(), StaticPages.deleteSupport); // Update a specific StaticPages by it's id

// Export
module.exports = router;
