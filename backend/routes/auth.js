const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.get('/users', verifyToken, requireRole(['admin']), getAllUsers);

module.exports = router;
