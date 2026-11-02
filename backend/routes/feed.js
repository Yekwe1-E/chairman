const express = require('express');
const router = express.Router();
const { getFeedItems, createFeedItem, logFeedConsumption } = require('../controllers/feedController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getFeedItems);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createFeedItem);
router.post('/consume', verifyToken, requireRole(['admin', 'manager', 'worker']), logFeedConsumption);

module.exports = router;
