const router = require("express").Router();
const BookLibraries = require("../controllers/BookLibraries");
const {
  validateBookLibrary,
  validateAddWork,
  validateEditWork,
  validateAddCategory,
  validateEditCategory,
  validateAddWorkDetail,
  validateEditWorkDetail,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post BookLibrary signup
 * @method get get all BookLibraries
 * @method get get BookLibrary by id
 * @method put update BookLibrary
 * @method delete delete BookLibrary
 */

// create - BookLibrary Signup
router.post(
  "/create",
  validateBookLibrary,
  isValidated,
  Auth(),
  BookLibraries.create
);
// Add a family to specific BookLibrary by it's id
router.post("/addFamily", Auth(), BookLibraries.addFamily);
// Add a category to specific BookLibrary by it's id
router.post(
  "/addCategory",
  validateAddCategory,
  isValidated,
  Auth(),
  BookLibraries.addCategory
);
// Update a category to specific BookLibrary by it's id

router.put(
  "/editCategory/:categoryId",

  Auth(),
  BookLibraries.editCategory
);
// Add a work to specific BookLibrary by it's id
router.post(
  "/addWork",
  validateAddWork,
  isValidated,
  Auth(),
  BookLibraries.addWork
);
// Update a work to specific BookLibrary by it's id

router.put(
  "/editWork/:workId",

  Auth(),
  BookLibraries.editWork
);

// Add a work detail to specific BookLibrary by it's id
router.post(
  "/addWorkDetail",
  validateAddWorkDetail,
  isValidated,
  Auth(),
  BookLibraries.addWorkDetail
);
// Update a workDetail to specific BookLibrary by it's id

router.put(
  "/editWorkDetail/:workDetailId",

  Auth(),
  BookLibraries.editWorkDetail
);
// Read
router.get("/", BookLibraries.getAll); // Get all BookLibraries at once
router.get("/:BookLibraryId", BookLibraries.getById); // Get one BookLibrary by it's id
router.get("/search/getlibraries", BookLibraries.search);

// Update
router.put("/:BookLibraryId", Auth(), BookLibraries.update); // Update a specific BookLibrary by it's id

// Delete
router.delete("/:BookLibraryId", Auth(), BookLibraries.delete); // delete a specific BookLibrary by it's id
// Delete a category to specific BookLibrary by it's id
router.delete(
  "/deleteCategory/:categoryId",
  Auth(),
  BookLibraries.deleteCategory
);
// Delete a work to specific BookLibrary by it's id
router.delete("/deleteWork/:workId", Auth(), BookLibraries.deleteWork);
// Delete a work detail to specific BookLibrary by it's id
router.delete(
  "/deleteWorkDetail/:workDetailId",
  Auth(),
  BookLibraries.deleteWorkDetail
);
// Export
module.exports = router;
