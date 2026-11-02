const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, requireRole(['admin']), getAuditLogs);

module.exports = router;
