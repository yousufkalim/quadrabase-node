const router = require("express").Router();
const Tranches = require("../controllers/Tranches");
const { validateTranches, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModal = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Tranches signup
 * @method get get all Tranches
 * @method get get Tranches by id
 * @method put update Tranches
 * @method delete delete Tranches
 */

// create
router.post(
  "/create",
  validateTranches,
  isValidated,
  Auth(ArchitectsModal),
  Tranches.create
);

// Read
router.get("/", Auth(ArchitectsModal), Tranches.getAll); // Get all Tranches at once

// Update
router.put("/:tranchId", Auth(ArchitectsModal), Tranches.update); // Update a specific Tranches by it's id

// Delete
router.delete("/:tranchId", Auth(ArchitectsModal), Tranches.delete); // delete a specific Tranches by it's id

// Export
module.exports = router;
