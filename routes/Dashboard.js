const router = require("express").Router();
const Dashboard = require("../controllers/Dashboard");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get
 */

// Read
router.get("/QuadrabaseUsers", Dashboard.getQuadrabaseUsers); // Get all QuadrabaseUsers
router.get("/NumberofRegistered", Dashboard.NumberofRegistered); // Get all NumberofRegistered
router.get("/numberofsubscriber", Dashboard.numberofsubscriber); // Get all numberofsubscriber
router.get("/ProjectsinProgress", Dashboard.ProjectsinProgress); // Get all ProjectsinProgress

// Export
module.exports = router;
