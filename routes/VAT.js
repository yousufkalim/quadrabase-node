const router = require("express").Router();
const VAT = require("../controllers/VAT");
const {
  validateVAT,
  validateVATUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post VAT signup
 * @method get get all VAT
 * @method get get VAT by id
 * @method put update VAT
 * @method delete delete VAT
 */

// create - VAT Signup
router.post("/create", validateVAT, isValidated, VAT.create);

// Read
router.get("/", VAT.getAll); // Get all VAT at once
router.get("/:VATId", VAT.getById); // Get one VAT by it's id

// Update
router.put(
  "/:VATId",

  validateVATUpdate,
  isValidated,
  VAT.update
); // Update a specific VAT by it's id

// Delete
router.delete("/:VATId", VAT.delete); // delete a specific VAT by it's id

// Export
module.exports = router;
