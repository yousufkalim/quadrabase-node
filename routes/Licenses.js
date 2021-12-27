const router = require("express").Router();
const Lincenses = require("../controllers/Lincenses");
const { validateLincese, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModel = require("../models/Architects");

// post - buy subscription
router.post(
  "/buy/:architectId",
  validateLincese,
  isValidated,
  Auth(ArchitectsModel),
  Lincenses.buy
);

// get - get licenses by architectId
router.get("/:architectId", Auth(ArchitectsModel), Lincenses.getByArchitectId);

// put - assign subscription
router.put("/:licenseId", Auth(ArchitectsModel), Lincenses.assign);

// put - buy subscription
router.put(
  "/buycredits/:licenseId",
  validateLincese,
  isValidated,
  Auth(ArchitectsModel),
  Lincenses.buycredits
);

// put - renew subscription
router.put(
  "/renew/:licenseId",
  validateLincese,
  isValidated,
  Auth(ArchitectsModel),
  Lincenses.renew
);

// Export
module.exports = router;
