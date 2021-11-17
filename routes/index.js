/**
 * All api routes handles here
 * @author Shehzad Ahmed
 */
const router = require("express").Router();

// Parent Routes
router.use("/Admins", require("./Admins")); // All the Admins routes
router.use("/Architects", require("./Architects")); // All the Architects routes
router.use("/BookLibraries", require("./BookLibraries")); // All the BookLibraries routes
router.use("/Subscriptions", require("./Subscriptions")); // All the Subscriptions routes
router.use("/Providers", require("./Providers")); // All the Providers routes
router.use("/Chap0", require("./Chap0")); // All the Chap0 routes
router.use("/VAT", require("./VAT")); // All the VAT routes
router.use("/Units", require("./Units")); // All the Units routes
router.use("/CCTP", require("./CCTP")); // All the CCTP routes
router.use("/Families", require("./Families")); // All the Families routes

// Export
module.exports = router;
