const router = require("express").Router();
const Chaps = require("../controllers/Chaps");
const {
  validateChaps,
  validateChapsUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post chaps signup
 * @method get get all Chaps
 * @method get get chaps by id
 * @method put update chaps
 * @method delete delete chaps
 */

// create - chaps Signup
router.post("/create", validateChaps, isValidated, Chaps.create);

// Read
router.get("/", Chaps.getAll); // Get all Chaps at once
router.get("/:chapsId", Chaps.getById); // Get one chaps by it's id

// Update
router.put(
  "/:chapsId",

  validateChapsUpdate,
  isValidated,
  Chaps.update
); // Update a specific chaps by it's id

// Delete
router.delete("/:chapsId", Chaps.delete); // delete a specific chaps by it's id

// Export
module.exports = router;
