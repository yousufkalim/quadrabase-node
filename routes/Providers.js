const router = require("express").Router();
const Providers = require("../controllers/Providers");
const { validateProvider, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModel = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Provider signup
 * @method get get all Providers
 * @method get get Provider by id
 * @method put update Provider
 * @method delete delete Provider
 */

// create - Provider Signup
router.post("/create", validateProvider, isValidated, Providers.create);

// create - Provider Signup
router.post("/createOnSingup", validateProvider, isValidated, Providers.createOnSingup);
///download invoice pdf api
router.post("/download", Providers.generatePdf);

///download quote pdf api
router.post("/quote/download", Providers.generateQuotePdf);

// Read
router.get("/", Auth(), Providers.getAll); // Get all Providers at once
router.get("/get/all", Auth(ArchitectsModel), Providers.getAll); // Get all Providers at once
router.get("/:providerId", Providers.getById); // Get one Provider by it's id
router.get("/works/:providerId", Auth(), Providers.getWorksByProviderId); // Get all works attached to Provider by it's id

// Update
router.put("/:providerId", validateProvider, isValidated, Auth(), Providers.update); // Update a specific Provider by it's id
router.put("/addsubscription/:providerId", Auth(), Providers.addSubscription); /// assign subscription to provider

// Delete
router.delete("/:providerId", Auth(), Providers.delete); // delete a specific Provider by it's id

// Export
module.exports = router;
