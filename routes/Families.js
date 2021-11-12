const router = require("express").Router();
const Families = require("../controllers/Families");
const { upload } = require("../middleware/multer");
const {
  validateFamily,
  validateFamilyUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post family signup
 * @method get get all Families
 * @method get get family by id
 * @method put update family
 * @method delete delete family
 */

// create - family Signup
router.post(
  "/create",
  upload.single("logo"),
  validateFamily,
  isValidated,
  Families.create
);

// Read
router.get("/", Families.getAll); // Get all Families at once
router.get("/:familyId", Families.getById); // Get one family by it's id

// Update
router.put(
  "/:familyId",
  upload.single("logo"),

  validateFamilyUpdate,
  isValidated,
  Families.update
); // Update a specific family by it's id

// Delete
router.delete("/:familyId", Families.delete); // delete a specific family by it's id

// Export
module.exports = router;
