const router = require("express").Router();
const Providers = require("../controllers/Providers");
const { upload } = require("../middleware/multer");
const {
  validateProvider,
  validateProviderUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Provider signup
 * @method get get all Providers
 * @method get get Provider by id
 * @method put update Provider
 * @method delete delete Provider
 */

// create - Provider Signup
router.post(
  "/create",
  upload.single("logo"),
  validateProvider,
  isValidated,
  Providers.create
);

// Read
router.get("/", Providers.getAll); // Get all Providers at once
router.get("/:providerId", Providers.getById); // Get one Provider by it's id

// Update
router.put(
  "/:providerId",
  upload.single("logo"),

  validateProviderUpdate,
  isValidated,
  Providers.update
); // Update a specific Provider by it's id

// Delete
router.delete("/:providerId", Providers.delete); // delete a specific Provider by it's id

// Export
module.exports = router;
