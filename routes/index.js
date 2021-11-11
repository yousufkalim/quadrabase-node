/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require("express").Router();

// Parent Routes
router.use("/Admins", require("./Admins")); // All the Admins routes
router.use("/Providers", require("./Providers")); // All the Providers routes
router.use("/Chaps", require("./Chaps")); // All the Chaps routes
router.use("/VAT", require("./VAT")); // All the VAT routes
router.use("/Units", require("./Units")); // All the Units routes
router.use("/CCTP", require("./CCTP")); // All the Units routes

// Export
module.exports = router;
