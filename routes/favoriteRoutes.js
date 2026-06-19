const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addFavorite, getFavoritesByEmail, removeFavorite } = require('../controllers/favoriteController');

router.post('/', verifyToken, addFavorite);
router.get('/:email', verifyToken, getFavoritesByEmail);
router.delete('/:id', verifyToken, removeFavorite);

module.exports = router;
