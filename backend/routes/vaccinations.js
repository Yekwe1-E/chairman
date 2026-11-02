const express = require('express');
const router = express.Router();
const { getVaccinations, createVaccination } = require('../controllers/vaccinationController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getVaccinations);
router.post('/', verifyToken, requireRole(['admin', 'manager', 'worker']), createVaccination);

module.exports = router;
