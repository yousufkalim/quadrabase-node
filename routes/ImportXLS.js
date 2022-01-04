const router = require("express").Router();
const ImportXLS = require("../controllers/ImportXLS");
const Auth = require("../middleware/auth");
const upload = require("../middleware/multer.js");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method import Import XLS
 */

// import - XLS
router.post("/import", Auth(), upload("/", "file", "single"), ImportXLS.import);

// Export
module.exports = router;
