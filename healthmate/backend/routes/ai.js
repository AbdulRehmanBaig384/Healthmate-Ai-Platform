const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getHealthTips,  getFriendlyMessage, getAIInsights} = require('../controllers/aiController');
const { chatWithDoctor } = require('../controllers/aiChatController');

// all routes are protected
router.use(protect);
router.post('/chat', chatWithDoctor);
router.get('/health-tips', getHealthTips);
router.get('/friendly-message', getFriendlyMessage);
router.get('/insights', getAIInsights);
module.exports = router;
