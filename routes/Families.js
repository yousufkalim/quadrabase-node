const router = require("express").Router();
const Families = require("../controllers/Families");
const { upload } = require("../middleware/multer");
const { validateFamily, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

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
  Auth(),
  Families.create
);

// Read
router.get("/", Auth(), Families.getAll); // Get all Families at once
router.get("/:familyId", Auth(), Families.getById); // Get one family by it's id

// Update
router.put(
  "/:familyId",
  upload.single("logo"),
  validateFamily,
  isValidated,
  Auth(),
  Families.update
); // Update a specific family by it's id

// Delete
router.delete("/:familyId", Auth(), Families.delete); // delete a specific family by it's id

// Export
module.exports = router;
