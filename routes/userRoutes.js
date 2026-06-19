const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const {
  getUserRole,
  getUserByEmail,
  updateUser,
  getAllUsers,
  changeUserRole,
} = require('../controllers/userController');

router.get('/role/:email', verifyToken, getUserRole);
router.get('/:email', verifyToken, getUserByEmail);
router.patch('/:email', verifyToken, updateUser);

router.get('/', verifyToken, verifyRole(['admin']), getAllUsers);
router.patch('/role/:id', verifyToken, verifyRole(['admin']), changeUserRole);

module.exports = router;
