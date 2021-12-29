const router = require("express").Router();
const ArchitectsChap0 = require("../controllers/ArchitectsChap0");
const ArchitectsModel = require("../models/Architects");
const {
  validateArchitectsChap0,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create ArchitectsChap0
 * @method get get all ArchitectsChap0
 * @method get get ArchitectsChap0 by id
 * @method put update ArchitectsChap0
 * @method delete delete ArchitectsChap0
 */

// create ArchitectsChap0
router.post(
  "/create",
  validateArchitectsChap0,
  isValidated,
  Auth(ArchitectsModel),
  ArchitectsChap0.create
);

// Read
router.get("/", Auth(ArchitectsModel), ArchitectsChap0.getAll); // get all ArchitectsChap0
router.get(
  "/:architectsChap0Id",
  Auth(ArchitectsModel),
  ArchitectsChap0.getById
); // get ArchitectsChap0 by id
router.get(
  "/current/architectchap0part2",
  Auth(ArchitectsModel),
  ArchitectsChap0.getByIdArchitectId
); // get ArchitectsChap0 by architect id

// Update
router.put(
  "/:architectsChap0Id",
  validateArchitectsChap0,
  isValidated,
  Auth(ArchitectsModel),
  ArchitectsChap0.update
); // Update a specific ArchitectsChap0 by it's id

// Delete
router.delete(
  "/:architectsChap0Id",
  Auth(ArchitectsModel),
  ArchitectsChap0.delete
); // delete a specific ArchitectsChap0 by it's id

// Export
module.exports = router;
