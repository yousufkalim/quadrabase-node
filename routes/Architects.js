const router = require("express").Router();
const Architects = require("../controllers/Architects");
const { upload } = require("../middleware/multer");
const Auth = require("../middleware/auth");

const {
  validateArchitect,
  validateArchitectUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post architect signup
 * @method get get all Architects
 * @method get get architect by id
 * @method put update architect
 * @method delete delete architect
 */

// create - architect Signup
router.post(
  "/create",
  upload.single("logo"),
  validateArchitect,
  isValidated,
  Auth(),
  Architects.create
);

// Read
router.get("/", Auth(), Architects.getAll); // Get all Architects at once
router.get("/:architectId", Auth(), Architects.getById); // Get one architect by it's id

// Update
router.put(
  "/:architectId",
  upload.single("logo"),
  Auth(),
  validateArchitectUpdate,
  isValidated,
  Architects.update
); // Update a specific architect by it's id

// Delete
router.delete("/:architectId", Auth(), Architects.delete); // delete a specific architect by it's id

// Export
module.exports = router;
