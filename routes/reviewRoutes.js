const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addReview, getPropertyReviews, getTopReviews } = require('../controllers/reviewController');

router.get('/top', getTopReviews);
router.get('/property/:propertyId', getPropertyReviews);
router.post('/', verifyToken, addReview);

module.exports = router;
