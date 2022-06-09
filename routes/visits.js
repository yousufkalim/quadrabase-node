const router = require("express").Router();
const Visit = require("../controllers/Visits");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get
 */

// Read
router.post("/", Visit.postVist); // Get all QuadrabaseUsers
router.get("/Days", Visit.getVistByDays); // Get all QuadrabaseUsers
router.get("/Months", Visit.getVistByMonths); // Get all QuadrabaseUsers

// Export
module.exports = router;
