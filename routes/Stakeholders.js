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

// create stakeholder
router.post(
  "/byproject/create/:type",
  validateStakeholder,
  isValidated,
  Auth(ArchitectsModal),
  Stakeholders.createByProject
);

// Read
router.get("/", Auth(ArchitectsModal), Stakeholders.getAll); // get all stakeholders
router.get("/:stakeholderID", Stakeholders.getById); // get stakeholder by id
router.get("/getByType/:typeId", Auth(ArchitectsModal), Stakeholders.getByType); // get stakeholder by typeId
router.get("/getByArchitect/:architectId", Stakeholders.getByArchitect); // get stakeholder by typeId
router.get(
  "/getByTypeName/:type",
  Auth(ArchitectsModal),
  Stakeholders.getByTypeName
); // Get all StakeholderTypes at once

// Update
router.put("/:stakeholderID", Stakeholders.update); // Update a specific stakeholder by it's id

// Delete
router.delete("/:stakeholderID", Stakeholders.delete); // delete a specific stakeholder by it's id
router.delete("/:stakeholderID/:architectId", Stakeholders.deleteByArchitect); // delete a specific stakeholder by it's id

// Export
module.exports = router;
