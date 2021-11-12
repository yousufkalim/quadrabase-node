const router = require("express").Router();
const BookLibraries = require("../controllers/BookLibraries");
const {
  validateBookLibrary,
  validateBookLibraryUpdate,
  validateAddWork,
  validateEditWork,
  validateAddCategory,
  validateEditCategory,
  validateAddWorkDetail,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post BookLibrary signup
 * @method get get all BookLibraries
 * @method get get BookLibrary by id
 * @method put update BookLibrary
 * @method delete delete BookLibrary
 */

// create - BookLibrary Signup
router.post("/create", validateBookLibrary, isValidated, BookLibraries.create);
// Add a family to specific BookLibrary by it's id
router.post("/addFamily", BookLibraries.addFamily);
// Add a category to specific BookLibrary by it's id
router.post(
  "/addCategory",
  validateAddCategory,
  isValidated,
  BookLibraries.addCategory
);
// Update a category to specific BookLibrary by it's id

router.put(
  "/editCategory/:categoryId",
  validateEditCategory,
  isValidated,
  BookLibraries.editCategory
);
// Add a work to specific BookLibrary by it's id
router.post("/addWork", validateAddWork, isValidated, BookLibraries.addWork);
// Update a work to specific BookLibrary by it's id

router.put(
  "/editWork/:workId",
  validateEditWork,
  isValidated,
  BookLibraries.editWork
);
// Add a work detail to specific BookLibrary by it's id
router.post(
  "/addWorkDetail",
  validateAddWorkDetail,
  isValidated,
  BookLibraries.addWorkDetail
);

// Read
router.get("/", BookLibraries.getAll); // Get all BookLibraries at once
router.get("/:BookLibraryId", BookLibraries.getById); // Get one BookLibrary by it's id

// Update
router.put(
  "/:BookLibraryId",
  validateBookLibraryUpdate,
  isValidated,
  BookLibraries.update
); // Update a specific BookLibrary by it's id

// Delete
router.delete("/:BookLibraryId", BookLibraries.delete); // delete a specific BookLibrary by it's id
// Delete a category to specific BookLibrary by it's id
router.delete("/deleteCategory/:categoryId", BookLibraries.deleteCategory);
// Delete a work to specific BookLibrary by it's id
router.delete("/deleteWork/:categoryId", BookLibraries.deleteWork);
// Export
module.exports = router;
