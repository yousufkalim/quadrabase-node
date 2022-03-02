const router = require("express").Router();
const Chap0Level2 = require("../controllers/Chap0Level2");
const { validateChap0, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Chap0Level2 signup
 * @method get get all Chap0Level2
 * @method get get Chap0Level2 by id
 * @method put update Chap0Level2
 * @method delete delete Chap0Level2
 */

// create - Chap0Level2 Signup
router.post("/create", validateChap0, isValidated, Auth(), Chap0Level2.create);

// Read
router.get("/", Auth(), Chap0Level2.getAll); // Get all Chap0Level2 at once
router.get("/:Chap0Id", Auth(), Chap0Level2.getById); // Get one Chap0Level2 by it's id
router.get("/getbyParentId/:parentId", Auth(), Chap0Level2.getbyParentId); // Get one Chap0Level2 by it's id

// Update
router.put("/:Chap0Id", Auth(), Chap0Level2.update); // Update a specific Chap0Level2 by it's id

// Delete
router.delete("/:Chap0Id", Auth(), Chap0Level2.delete); // delete a specific Chap0Level2 by it's id

// Export
module.exports = router;
