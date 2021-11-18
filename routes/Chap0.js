const router = require("express").Router();
const Chap0 = require("../controllers/Chap0");
const { validateChap0, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Chap0 signup
 * @method get get all Chap0
 * @method get get Chap0 by id
 * @method put update Chap0
 * @method delete delete Chap0
 */

// create - Chap0 Signup
router.post("/create", validateChap0, isValidated, Auth(), Chap0.create);

// Read
router.get("/", Auth(), Chap0.getAll); // Get all Chap0 at once
router.get("/:Chap0Id", Auth(), Chap0.getById); // Get one Chap0 by it's id

// Update
router.put("/:Chap0Id", validateChap0, isValidated, Auth(), Chap0.update); // Update a specific Chap0 by it's id

// Delete
router.delete("/:Chap0Id", Auth(), Chap0.delete); // delete a specific Chap0 by it's id

// Export
module.exports = router;
