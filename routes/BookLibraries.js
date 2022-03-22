const router = require("express").Router();
const BookLibraries = require("../controllers/BookLibraries");
const ArchitectsModal = require("../models/Architects");
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
router.post(
  "/architect/create",
  validateBookLibrary,
  isValidated,
  Auth(ArchitectsModal),
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

router.post(
  "/add/Category",
  validateAddCategory,
  isValidated,
  Auth(ArchitectsModal),
  BookLibraries.addCategory
);
// Update a category to specific BookLibrary by it's id

router.put(
  "/editCategory/:categoryId",

  Auth(),
  BookLibraries.editCategory
);
router.put(
  "/update/editCategory/:categoryId",

  Auth(ArchitectsModal),
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

router.post(
  "/add/Work",
  validateAddWork,
  isValidated,
  Auth(ArchitectsModal),
  BookLibraries.addWork
);
// Update a work to specific BookLibrary by it's id

router.put(
  "/editWork/:workId",

  Auth(),
  BookLibraries.editWork
);

router.put(
  "/edit/Work/:workId",

  Auth(ArchitectsModal),
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

router.post(
  "/add/WorkDetail",
  validateAddWorkDetail,
  isValidated,
  Auth(ArchitectsModal),
  BookLibraries.addWorkDetail
);
// Update a workDetail to specific BookLibrary by it's id

router.put(
  "/editWorkDetail/:workDetailId",

  Auth(),
  BookLibraries.editWorkDetail
);

router.put(
  "/edit/WorkDetail/:workDetailId",

  Auth(ArchitectsModal),
  BookLibraries.editWorkDetail
);
// Read
router.get("/", BookLibraries.getAll); // Get all BookLibraries at once
router.get("/getByFamily/:FamilyId", BookLibraries.getByFamily); // Get all BookLibraries at once
router.get("/getByArchitect/:ArchitectId", BookLibraries.getByArchitect); // Get one BookLibrary by it's id
router.get("/getLevel2/:BookLibraryId", BookLibraries.getLevel2); // Get all BookLibraries at once
router.get("/getLevel3/:CategoryId", BookLibraries.getLevel3); // Get all BookLibraries at once
router.get("/getLevel4/:WorkId", BookLibraries.getLevel4); // Get all BookLibraries at once
router.get(
  "/private/getByFamily/:FamilyId",
  BookLibraries.getPrivateLibByFamily
); // Get all BookLibraries at once
router.get("/getTwoLevels", BookLibraries.getTwoLevels); // Get all BookLibraries at once
router.get("/:BookLibraryId", BookLibraries.getById); // Get one BookLibrary by it's id
router.get("/search/getlibraries", BookLibraries.search);
router.get("/getByArchitectId/:ArchitectId", BookLibraries.getByArchitectId); // Get one BookLibrary by it's id

// Update
router.put("/:BookLibraryId", Auth(), BookLibraries.update); // Update a specific BookLibrary by it's id
router.put(
  "/update/:BookLibraryId",
  Auth(ArchitectsModal),
  BookLibraries.update
); // Update a specific BookLibrary by it's id

// Delete
router.delete("/:BookLibraryId", Auth(), BookLibraries.delete); // delete a specific BookLibrary by it's id
router.delete(
  "/delete/:BookLibraryId",
  Auth(ArchitectsModal),
  BookLibraries.delete
); // delete a specific BookLibrary by it's id
// Delete a category to specific BookLibrary by it's id
router.delete(
  "/deleteCategory/:categoryId",
  Auth(),
  BookLibraries.deleteCategory
);
router.delete(
  "/delete/Category/:categoryId",
  Auth(ArchitectsModal),
  BookLibraries.deleteCategory
);
// Delete a work to specific BookLibrary by it's id
router.delete("/deleteWork/:workId", Auth(), BookLibraries.deleteWork);
router.delete(
  "/delete/Work/:workId",
  Auth(ArchitectsModal),
  BookLibraries.deleteWork
);
// Delete a work detail to specific BookLibrary by it's id
router.delete(
  "/deleteWorkDetail/:workDetailId",
  Auth(),
  BookLibraries.deleteWorkDetail
);

router.delete(
  "/delete/WorkDetail/:workDetailId",
  Auth(ArchitectsModal),
  BookLibraries.deleteWorkDetail
);
// Export
module.exports = router;
