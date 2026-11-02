const express = require('express');
const router = express.Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getActivities);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'worker']), createActivity);

module.exports = router;
