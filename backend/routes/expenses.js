const express = require('express');
const router = express.Router();
const { getExpenses, createExpense } = require('../controllers/expenseController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getExpenses);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'finance']), createExpense);

module.exports = router;
