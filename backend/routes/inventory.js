const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem } = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getInventory);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createInventoryItem);

module.exports = router;
