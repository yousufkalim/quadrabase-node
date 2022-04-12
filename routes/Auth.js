const router = require("express").Router();
const Auth = require("../controllers/Auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post User signup
 */

// login - User Login
router.post("/login", Auth.login);

// Export
module.exports = router;
