const express = require('express');
const router = express.Router();
const { getEquipment, createEquipment } = require('../controllers/equipmentController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getEquipment);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createEquipment);

module.exports = router;
