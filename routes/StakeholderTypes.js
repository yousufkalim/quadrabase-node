const router = require("express").Router();
const StakeholderTypes = require("../controllers/StakeholderTypes");
const {
  validateStakeholderTypes,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModal = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post StakeholderTypes signup
 * @method get get all StakeholderTypes
 * @method get get StakeholderTypes by id
 * @method put update StakeholderTypes
 * @method delete delete StakeholderTypes
 */

// create - StakeholderTypes Signup
router.post(
  "/create",
  validateStakeholderTypes,
  isValidated,
  StakeholderTypes.create
);

// Read
router.get("/", StakeholderTypes.getAll); // Get all StakeholderTypes at once
router.get(
  "/getByStakeholder/:stakeholderId",
  StakeholderTypes.getByStakeholder
); // Get all StakeholderTypes at once

// Update
router.put("/:stakeholderTypeId", Auth(), StakeholderTypes.update); // Update a specific StakeholderTypes by it's id

// Delete
router.delete("/:stakeholderTypeId", Auth(), StakeholderTypes.delete); // delete a specific StakeholderTypes by it's id

// Export
module.exports = router;
