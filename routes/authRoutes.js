const express = require('express');
const router = express.Router();
const { registerUser, loginUser, issueToken } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/jwt', issueToken);

module.exports = router;
