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

// post
router.post(
  "/create",
  validateProjects,
  isValidated,
  Auth(ArchitectsModel),
  Projects.create
); // create Project
router.post(
  "/addWork/:projectId",
  validateAddWorkToProject,
  isValidated,
  Projects.addWork
); // add work to project

// Read
router.get("/", Projects.getAll); // get all Projects
router.get("/byArchitect/:architectId", Projects.getByArchitect); // get all Projects
router.get("/:projectId", Projects.getById); // get Projects by id
router.get("/works/:projectId", Projects.getWorks); // get Projects by id
router.get("/worksByTrades/:projectId", Projects.getWorksByTrades); // get Projects by id
router.get("/worksByTranches/:projectId", Projects.getWorksByTranches); // get Projects by id

// Update
router.put("/:projectId", Auth(ArchitectsModel), Projects.update); // Update a specific Projects by it's id
router.put("/updateWork/:projectId", Projects.updateWork); // Update a specific work
router.put("/updateWorkDetail/:projectId", Projects.updateWorkDetail); // Update a specific work detail
router.put("/updateWorkRanking/:projectId", Projects.updateWorkRanking);
router.put(
  "/updateWorkDetailRanking/:projectId",
  Projects.updateWorkDetailRanking
);

// Delete
router.delete("/:projectId", Projects.delete); // delete a specific Projects by it's id
router.delete("/deleteWork/:projectId", Projects.deleteWork); // delete work added in project
router.delete("/deleteWorkDetail/:projectId", Projects.deleteWorkDetail); // delete work added in project

// Export
module.exports = router;
