const router = require("express").Router();
const Units = require("../controllers/Units");
const {
  validateUnits,
  validateUnitsUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Units signup
 * @method get get all Units
 * @method get get Units by id
 * @method put update Units
 * @method delete delete Units
 */

// create - Units Signup
router.post("/create", validateUnits, isValidated, Units.create);

// Read
router.get("/", Units.getAll); // Get all Units at once
router.get("/:unitsId", Units.getById); // Get one Units by it's id

// Update
router.put("/:unitsId", validateUnitsUpdate, isValidated, Units.update); // Update a specific Units by it's id

// Delete
router.delete("/:unitsId", Units.delete); // delete a specific Units by it's id

// Export
module.exports = router;
