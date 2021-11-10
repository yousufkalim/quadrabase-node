const router = require("express").Router();
const Admins = require("../controllers/Admins");
const { upload } = require("../middleware/multer");
const {
  validateAdmin,
  validateAdminUpdate,
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
  upload.single("profile_picture"),
  validateAdmin,
  isValidated,
  Admins.register
);

// Read
router.get("/", Admins.getAll); // Get all Admins at once
router.get("/:userId", Admins.getById); // Get one admin by it's id

// Update
router.put(
  "/:userId",
  upload.single("profile_picture"),

  validateAdminUpdate,
  isValidated,
  Admins.update
); // Update a specific admin by it's id

// Delete
router.delete("/:userId", Admins.delete); // delete a specific admin by it's id

// Export
module.exports = router;
