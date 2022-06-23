const router = require("express").Router();
const Folders = require("../controllers/Folders");
const Auth = require("../middleware/auth");
const upload = require("../middleware/multer");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Folders signup
 * @method get get all Folders
 * @method get get Folders by id
 * @method put update Folders
 * @method delete delete Folders
 */

// create - Folders Signup
router.post("/create", Auth(), Folders.create);
router.post("/createSubFolder/:parentId", Auth(), Folders.createSubFolder);

// Read
router.get("/", Auth(), Folders.getAllFolders); // Get all Folders at once
router.get("/:parentId", Auth(), Folders.getSubFolders); // Get one Folders by it's id

// Update
router.put("/:id", Auth(), Folders.update); // Update Folder
router.put("/updateFile/:id", Auth(), Folders.updateFile); // Update Folder
router.put("/deleteFile/:id", Auth(), Folders.deleteFile); // Update Folder
router.put("/upload/:id", upload("/", "file", "single"), Auth(), Folders.uploadFile); // upload files

// Delete
router.delete("/:id", Auth(), Folders.delete); // Update Folder

// Export
module.exports = router;
