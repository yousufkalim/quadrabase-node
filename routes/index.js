/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
router.use("/Admins", require("./Admins")); // All the Admins routes
router.use("/Providers", require("./Providers")); // All the Providers routes

// Export
module.exports = router;
