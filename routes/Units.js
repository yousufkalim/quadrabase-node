const router = require("express").Router();
const Units = require("../controllers/Units");
const {
  validateUnits,
  validateUnitsUpdate,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Units signup
 * @method get get all Units
 * @method get get Units by id
 * @method put update Units
 * @method delete delete Units
 */

// create - Units Signup
router.post("/create", validateUnits, isValidated, Auth(), Units.create);

// Read
router.get("/", Auth(), Units.getAll); // Get all Units at once
router.get("/:unitsId", Auth(), Units.getById); // Get one Units by it's id

// Update
router.put("/:unitsId", validateUnitsUpdate, isValidated, Auth(), Units.update); // Update a specific Units by it's id

// Delete
router.delete("/:unitsId", Auth(), Units.delete); // delete a specific Units by it's id

// Export
module.exports = router;
