const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createPaymentIntent } = require('../controllers/paymentController');

router.post('/create-payment-intent', verifyToken, createPaymentIntent);

module.exports = router;
