const router = require("express").Router();
const Subscriptions = require("../controllers/Subscriptions");
const { validateSubscription, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModel = require("../models/Architects");

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
  validateSubscription,
  isValidated,
  // Auth(),
  Subscriptions.create
);

// Read
router.get("/", Subscriptions.getAll); // Get all Subscriptions at once
router.get("/getAll/architect", Subscriptions.getAll); // Get all Subscriptions at once
router.get("/:subscriptionId", Subscriptions.getById); // Get one subscription by it's id

// Update
router.put("/:subscriptionId", validateSubscription, isValidated, Subscriptions.update); // Update a specific subscription by it's id

// Delete
router.delete("/:subscriptionId", Subscriptions.delete); // delete a specific subscription by it's id

// Export
module.exports = router;
