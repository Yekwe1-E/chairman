const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer } = require('../controllers/customerController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getCustomers);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'finance']), createCustomer);

module.exports = router;
