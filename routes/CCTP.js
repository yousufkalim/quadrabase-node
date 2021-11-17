const router = require("express").Router();
const CCTP = require("../controllers/CCTP");
const { validateCCTP, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post CCTP signup
 * @method get get all CCTP
 * @method get get CCTP by id
 * @method put update CCTP
 * @method delete delete CCTP
 */

// create - CCTP Signup
router.post("/create", validateCCTP, isValidated, Auth(), CCTP.create);

// Read
router.get("/", Auth(), CCTP.getAll); // Get all CCTP at once
router.get("/:CCTPId", Auth(), CCTP.getById); // Get one CCTP by it's id

// Update
router.put("/:CCTPId", validateCCTP, isValidated, Auth(), CCTP.update); // Update a specific CCTP by it's id

// Delete
router.delete("/:CCTPId", Auth(), CCTP.delete); // delete a specific CCTP by it's id

// Export
module.exports = router;
