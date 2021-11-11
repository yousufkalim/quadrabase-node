const router = require("express").Router();
const CCTP = require("../controllers/CCTP");
const {
  validateCCTP,
  validateCCTPUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post CCTP signup
 * @method get get all CCTP
 * @method get get CCTP by id
 * @method put update CCTP
 * @method delete delete CCTP
 */

// create - CCTP Signup
router.post("/create", validateCCTP, isValidated, CCTP.create);

// Read
router.get("/", CCTP.getAll); // Get all CCTP at once
router.get("/:CCTPId", CCTP.getById); // Get one CCTP by it's id

// Update
router.put("/:CCTPId", validateCCTPUpdate, isValidated, CCTP.update); // Update a specific CCTP by it's id

// Delete
router.delete("/:CCTPId", CCTP.delete); // delete a specific CCTP by it's id

// Export
module.exports = router;
