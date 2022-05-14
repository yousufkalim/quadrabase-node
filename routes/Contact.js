const router = require("express").Router();
const Contact = require("../controllers/Contact");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post send contact message
 */

// Read
router.post("/", Contact.sendMail); // Get all Units at once

// Export
module.exports = router;
