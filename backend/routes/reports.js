const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getReportData } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

router.get('/dashboard', verifyToken, getDashboardMetrics);
router.get('/export', verifyToken, getReportData);

module.exports = router;
