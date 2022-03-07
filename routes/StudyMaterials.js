const router = require("express").Router();
const StudyMaterials = require("../controllers/StudyMaterials");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get Get all StudyMaterial
 */

// Read
router.get("/", StudyMaterials.getAll); // Get all Units at once

// Export
module.exports = router;
