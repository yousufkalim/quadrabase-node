const router = require("express").Router();
const Projects = require("../controllers/Projects");
const {
  validateProjects,
  validateAddWorkToProject,
  isValidated,
} = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModel = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create Projects
 * @method get get all Projects
 * @method get get Projects by id
 * @method put update Projects
 * @method delete delete Projects
 */

// create Project
router.post(
  "/create",
  validateProjects,
  isValidated,
  Auth(ArchitectsModel),
  Projects.create
);

// Read
router.get("/", Projects.getAll); // get all Projects
router.get("/byArchitect/:architectId", Projects.getByArchitect); // get all Projects
router.get("/:projectId", Projects.getById); // get Projects by id
router.get("/works/:projectId", Projects.getWorks); // get Projects by id

// Update
router.put("/:projectId", validateProjects, isValidated, Projects.update); // Update a specific Projects by it's id

// Delete
router.delete("/:projectId", Projects.delete); // delete a specific Projects by it's id

// add work to project
router.post(
  "/addWork/:projectId",
  validateAddWorkToProject,
  isValidated,
  Projects.addWork
);

// Export
module.exports = router;
