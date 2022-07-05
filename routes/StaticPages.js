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
router.get('/terms', StaticPages.getTerms); // Get all StaticPages at once
router.get('/privacy', StaticPages.getPrivacy); // Get all StaticPages at once

// Update
router.put('/:StaticPageId', Auth(), StaticPages.update); // Update a specific StaticPages by it's id

// Export
module.exports = router;
