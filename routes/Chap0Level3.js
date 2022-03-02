const router = require("express").Router();
const Chap0Level3 = require("../controllers/Chap0Level3");
const { validateChap0, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Chap0Level3 signup
 * @method get get all Chap0Level3
 * @method get get Chap0Level3 by id
 * @method put update Chap0Level3
 * @method delete delete Chap0Level3
 */

// create - Chap0Level3 Signup
router.post("/create", validateChap0, isValidated, Auth(), Chap0Level3.create);

// Read
router.get("/", Auth(), Chap0Level3.getAll); // Get all Chap0Level3 at once
router.get("/:Chap0Id", Auth(), Chap0Level3.getById); // Get one Chap0Level3 by it's id
router.get("/getbyParentId/:parentId", Auth(), Chap0Level3.getbyParentId); // Get one Chap0Level2 by it's id

// Update
router.put("/:Chap0Id", Auth(), Chap0Level3.update); // Update a specific Chap0Level3 by it's id

// Delete
router.delete("/:Chap0Id", Auth(), Chap0Level3.delete); // delete a specific Chap0Level3 by it's id

// Export
module.exports = router;
