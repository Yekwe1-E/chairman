const express = require('express');
const router = express.Router();
const { getEggs, createEggRecord } = require('../controllers/eggController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getEggs);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'worker']), createEggRecord);

module.exports = router;
