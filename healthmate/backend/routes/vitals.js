const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {addVital,getVitals,getVital,updateVital,deleteVital,getVitalsSummary} = require('../controllers/vitalController');
router.use(protect);
router.get('/summary', getVitalsSummary);
router.get('/', getVitals);
router.post('/', addVital);
router.get('/:id', getVital);
router.put('/:id', updateVital);
router.delete('/:id', deleteVital);

module.exports = router;
