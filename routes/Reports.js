const router = require('express').Router();
const upload = require('../middleware/multer');
const Reports = require('../controllers/Reports');

// download invoice pdf api
router.post('/simple_estimation', Reports.simpleEstimation);
router.post('/tt_estimation', Reports.ttEstimation);
router.post('/bpu', Reports.BPU);
router.post('/dpgf', Reports.DPGF);
router.post('/cctp', Reports.CCTP);
router.post('/docx_to_pdf', upload('/uploads', 'buffer', 'single'), Reports.docxToPDF);

// Export
module.exports = router;
