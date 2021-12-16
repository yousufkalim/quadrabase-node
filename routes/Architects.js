const router = require("express").Router();
const Architects = require("../controllers/Architects");
const ArchitectsModel = require("../models/Architects");

const upload = require("../middleware/multer");
const Auth = require("../middleware/auth");

const {
  validateArchitect,
  validateUpdateArchitect,
  validateForgotPassword,
  validateResetPassword,
  validateBookLibrary,
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
  upload("/", "logo", "single"),

  validateArchitect,
  isValidated,
  Auth(),
  Architects.create
);
// create - BookLibrary
router.post(
  "/BookLibraries/create",
  validateBookLibrary,
  isValidated,
  Auth(ArchitectsModel),
  Architects.createBookLibrary
);
// login - Architect Login
router.post("/login", Architects.login);
// forgot password
router.post(
  "/forgotPassword",
  validateForgotPassword,
  isValidated,
  Architects.forgotPassword
);
// reset password
router.post(
  "/resetPassword",
  validateResetPassword,
  isValidated,
  Architects.resetPassword
);
// Read
router.get("/", Auth(), Architects.getAll); // Get all Architects at once
router.get("/:architectId", Auth(), Architects.getById); // Get one architect by it's id

// Update
router.put(
  "/:architectId",
  upload("/", "logo", "single"),

  Auth(),
  validateUpdateArchitect,
  isValidated,
  Architects.update
); // Update a specific architect by it's id

// Delete
router.delete("/:architectId", Auth(), Architects.delete); // delete a specific architect by it's id
// Delete
router.delete(
  "/BookLibraries/:BookLibraryId",
  Auth(ArchitectsModel),
  Architects.deleteBookLibrary
); // delete a specific architect by it's id

router.put("/addsubscription/:architectId", Auth(), Architects.addSubscription); // delete a specific architect by it's id

// Export
module.exports = router;
