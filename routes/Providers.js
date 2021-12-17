const router = require("express").Router();
const Providers = require("../controllers/Providers");
const { validateProvider, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Provider signup
 * @method get get all Providers
 * @method get get Provider by id
 * @method put update Provider
 * @method delete delete Provider
 */

// create - Provider Signup
router.post("/create", validateProvider, isValidated, Auth(), Providers.create);

// Read
router.get("/", Auth(), Providers.getAll); // Get all Providers at once
router.get("/:providerId", Auth(), Providers.getById); // Get one Provider by it's id

// Update
router.put(
  "/:providerId",
  validateProvider,
  isValidated,
  Auth(),
  Providers.update
); // Update a specific Provider by it's id

// Delete
router.delete("/:providerId", Auth(), Providers.delete); // delete a specific Provider by it's id

// Export
module.exports = router;
