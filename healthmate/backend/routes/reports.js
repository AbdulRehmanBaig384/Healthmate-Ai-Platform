const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const {uploadReport, getReports, getReport,updateReport, deleteReport, reanalyzeReport} = require('../controllers/reportController');
router.use(protect);
router.post('/upload', upload.single('file'), handleUploadError, uploadReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.post('/:id/analyze', reanalyzeReport);

module.exports = router;
