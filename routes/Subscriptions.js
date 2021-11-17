const router = require("express").Router();
const Subscriptions = require("../controllers/Subscriptions");
const { upload } = require("../middleware/multer");
const {
  validateSubscription,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post subscription signup
 * @method get get all Subscriptions
 * @method get get subscription by id
 * @method put update subscription
 * @method delete delete subscription
 */

// create - subscription Signup
router.post(
  "/create",
  upload.single("logo"),
  validateSubscription,
  isValidated,
  Auth(),
  Subscriptions.create
);

// Read
router.get("/", Auth(), Subscriptions.getAll); // Get all Subscriptions at once
router.get("/:subscriptionId", Auth(), Subscriptions.getById); // Get one subscription by it's id

// Update
router.put(
  "/:subscriptionId",
  upload.single("logo"),
  validateSubscription,
  isValidated,
  Auth(),
  Subscriptions.update
); // Update a specific subscription by it's id

// Delete
router.delete("/:subscriptionId", Auth(), Subscriptions.delete); // delete a specific subscription by it's id

// Export
module.exports = router;
