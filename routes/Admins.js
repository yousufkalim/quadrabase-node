const router = require("express").Router();
const Admins = require("../controllers/Admins");
const upload = require("../middleware/multer");
const Auth = require("../middleware/auth");

const {
  validateAdmin,
  validateAdminUpdate,
  validateForgotPassword,
  validateResetPassword,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post admin signup
 * @method get get all Admins
 * @method get get admin by id
 * @method put update admin
 * @method delete delete admin
 */

// register - Admin Signup
router.post(
  "/register",
  upload("/", "profile_pic", "single"),

  validateAdmin,
  isValidated,
  Admins.register
);
// login - Admin Login
router.post("/login", Admins.login);
// forgot password
router.post(
  "/forgotPassword",
  validateForgotPassword,
  isValidated,
  Admins.forgotPassword
);
// reset password
router.post(
  "/resetPassword",
  validateResetPassword,
  isValidated,
  Admins.resetPassword
);

// Read
router.get("/", Auth(), Admins.getAll); // Get all Admins at once
router.get("/:adminId", Auth(), Admins.getById); // Get one admin by it's id

// Update
router.put(
  "/:adminId",

  upload("/", "profile_pic", "single"),
  validateAdminUpdate,
  isValidated,
  Auth(),
  Admins.update
); // Update a specific admin by it's id

// Delete
router.delete("/:adminId", Auth(), Admins.delete); // delete a specific admin by it's id

// Export
module.exports = router;
