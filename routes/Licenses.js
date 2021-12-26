const router = require("express").Router();
const Lincenses = require("../controllers/Lincenses");
const { validateLincese, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

// post - buy subscription
router.post(
  "/buy/:architectId",
  validateLincese,
  isValidated,
  Auth(),
  Lincenses.buy
);

// get - get licenses by architectId
router.get("/:architectId", Auth(), Lincenses.getByArchitectId);

// put - assign subscription
router.put("/:licenseId", Auth(), Lincenses.assign);

// Export
module.exports = router;
