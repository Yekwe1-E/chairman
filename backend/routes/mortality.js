const express = require('express');
const router = express.Router();
const { getMortality, createMortality } = require('../controllers/mortalityController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getMortality);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'worker']), createMortality);

module.exports = router;
