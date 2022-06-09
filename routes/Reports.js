const router = require("express").Router();
const Reports = require("../controllers/Reports");

// download invoice pdf api
router.post("/simple_estimation", Reports.simpleEstimation);
router.post("/tt_estimation", Reports.ttEstimation);
router.post("/bpu", Reports.BPU);
router.post("/dpgf", Reports.DPGF);

// Export
module.exports = router;
