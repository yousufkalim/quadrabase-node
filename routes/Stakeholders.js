const router = require("express").Router();
const Stakeholders = require("../controllers/Stakeholders");
const {
  validateStakeholder,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModal = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create stakeholder
 * @method get get all stakeholders
 * @method get get stakeholder by id
 * @method put update stakeholder
 * @method delete delete stakeholder
 */

// create stakeholder
router.post(
  "/create",
  validateStakeholder,
  isValidated,
  Auth(),
  Stakeholders.create
);

router.post(
  "/create/:architectId",
  validateStakeholder,
  isValidated,
  Auth(ArchitectsModal),
  Stakeholders.createByArchitect
);

// Read
router.get("/", Stakeholders.getAll); // get all stakeholders
router.get("/:stakeholderID", Stakeholders.getById); // get stakeholder by id
router.get("/getByType/:typeId", Stakeholders.getByType); // get stakeholder by typeId

// Update
router.put(
  "/:stakeholderID",
  validateStakeholder,
  isValidated,
  Stakeholders.update
); // Update a specific stakeholder by it's id

// Delete
router.delete("/:stakeholderID", Stakeholders.delete); // delete a specific stakeholder by it's id
router.delete("/:stakeholderID/:architectId", Stakeholders.deleteByArchitect); // delete a specific stakeholder by it's id

// Export
module.exports = router;
