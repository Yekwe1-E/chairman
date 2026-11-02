const express = require('express');
const router = express.Router();
const { getHouses, createHouse, updateHouse, deleteHouse } = require('../controllers/houseController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', verifyToken, getHouses);
router.post('/', verifyToken, requireRole(['admin', 'manager']), createHouse);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), updateHouse);
router.delete('/:id', verifyToken, requireRole(['admin']), deleteHouse);

module.exports = router;
