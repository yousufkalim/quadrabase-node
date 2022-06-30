const router = require("express").Router();
const Trades = require("../controllers/Trades");
const { validateTrades, isValidated } = require("../middleware/validators");
const Auth = require("../middleware/auth");
const ArchitectsModal = require("../models/Architects");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Trades signup
 * @method get get all Trades
 * @method get get Trades by id
 * @method put update Trades
 * @method delete delete Trades
 */

// create
router.post("/create", validateTrades, isValidated, Auth(ArchitectsModal), Trades.create);

// Read
router.get("/:projectId", Auth(ArchitectsModal), Trades.getAll); // Get all Trades at once

// Update
router.put("/:tradeId", Auth(ArchitectsModal), Trades.update); // Update a specific Trades by it's id

// Delete
router.delete("/:tradeId/:projectId", Auth(ArchitectsModal), Trades.delete); // delete a specific Trades by it's id

// Export
module.exports = router;
