const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier } = require('../controllers/supplierController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getSuppliers);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'finance']), createSupplier);

module.exports = router;
