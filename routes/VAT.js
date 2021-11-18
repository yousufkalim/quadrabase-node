const router = require("express").Router();
const VAT = require("../controllers/VAT");
const { validateVAT, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post VAT signup
 * @method get get all VAT
 * @method get get VAT by id
 * @method put update VAT
 * @method delete delete VAT
 */

// create - VAT Signup
router.post("/create", validateVAT, isValidated, Auth(), VAT.create);

// Read
router.get("/", Auth(), VAT.getAll); // Get all VAT at once
router.get("/:VATId", Auth(), VAT.getById); // Get one VAT by it's id

// Update
router.put("/:VATId", validateVAT, isValidated, Auth(), VAT.update); // Update a specific VAT by it's id

// Delete
router.delete("/:VATId", Auth(), VAT.delete); // delete a specific VAT by it's id

// Export
module.exports = router;
