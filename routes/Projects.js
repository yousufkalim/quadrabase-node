const router = require("express").Router();
const Projects = require("../controllers/Projects");
const { validateProjects, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create Projects
 * @method get get all Projects
 * @method get get Projects by id
 * @method put update Projects
 * @method delete delete Projects
 */

// create Project
router.post("/create", validateProjects, isValidated, Projects.create);

// Read
router.get("/", Projects.getAll); // get all Projects
router.get("/:projectId", Projects.getById); // get Projects by id

// Update
router.put("/:projectId", validateProjects, isValidated, Projects.update); // Update a specific Projects by it's id

// Delete
router.delete("/:projectId", Projects.delete); // delete a specific Projects by it's id

// Export
module.exports = router;
