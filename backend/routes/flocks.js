const express = require('express');
const router = express.Router();
const { getFlocks, createFlock, updateFlock, deleteFlock } = require('../controllers/flockController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getFlocks);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createFlock);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), updateFlock);
router.delete('/:id', verifyToken, requireRole(['admin']), deleteFlock);

module.exports = router;
