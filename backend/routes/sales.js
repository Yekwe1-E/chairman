const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/salesController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getSales);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'finance']), createSale);

module.exports = router;
