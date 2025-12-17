const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/users', authController.users);
router.post('/sessions', authController.sessions);

module.exports = router;
