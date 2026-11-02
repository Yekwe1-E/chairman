const express = require('express');
const router = express.Router();
const { getMedications, createMedication } = require('../controllers/medicationController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getMedications);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createMedication);

module.exports = router;
