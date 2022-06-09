/**
 * All api routes handles here
 * @author Shehzad Ahmed
 */
const router = require("express").Router();

// Parent Routes
router.use("/Auth", require("./Auth")); // All the Admins routes
router.use("/Admins", require("./Admins")); // All the Admins routes
router.use("/Architects", require("./Architects")); // All the Architects routes
router.use("/BookLibraries", require("./BookLibraries")); // All the BookLibraries routes
router.use("/Subscriptions", require("./Subscriptions")); // All the Subscriptions routes
router.use("/Providers", require("./Providers")); // All the Providers routes
router.use("/Chap0", require("./Chap0")); // All the Chap0 routes
router.use("/Chap0Level2", require("./Chap0Level2")); // All the Chap0 routes
router.use("/Chap0Level3", require("./Chap0Level3")); // All the Chap0 routes
router.use("/VAT", require("./VAT")); // All the VAT routes
router.use("/Units", require("./Units")); // All the Units routes
router.use("/CCTP", require("./CCTP")); // All the CCTP routes
router.use("/Families", require("./Families")); // All the Families routes
router.use("/fileUploader", require("./fileUploader")); // All the Families routes
router.use("/Stakeholders", require("./Stakeholders")); // All the stakeholder routes
router.use("/StakeholderTypes", require("./StakeholderTypes")); // All the stakeholder routes
router.use("/ArchitectsChap0", require("./ArchitectsChap0")); // All the ArchitectsChap0 routes
router.use("/project", require("./Projects")); // All the Project routes
router.use("/licenses", require("./Licenses")); // All the License routes
router.use("/ImportXLS", require("./ImportXLS")); // All the ImportXLS routes
router.use("/Tranches", require("./Tranches")); // All the Tranches routes
router.use("/Trades", require("./Trades")); // All the Trades routes
router.use("/StudyMaterials", require("./StudyMaterials")); // All the StudyMaterials routes
router.use("/Contact", require("./Contact")); // Contact routes
router.use("/Dashboard", require("./Dashboard")); // Contact routes
router.use("/Vists", require("./visits")); // Contact routes

// Export
module.exports = router;
