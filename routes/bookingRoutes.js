const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookingsAdmin,
  getTransactions,
  getOwnerStats,
} = require('../controllers/bookingController');

router.post('/', verifyToken, createBooking);
router.get('/tenant/:email', verifyToken, getTenantBookings);
router.get('/owner/:email', verifyToken, verifyRole(['owner', 'admin']), getOwnerBookings);
router.patch('/status/:id', verifyToken, verifyRole(['owner', 'admin']), updateBookingStatus);
router.get('/admin/all', verifyToken, verifyRole(['admin']), getAllBookingsAdmin);
router.get('/transactions', verifyToken, verifyRole(['admin']), getTransactions);
router.get('/stats/owner/:email', verifyToken, verifyRole(['owner', 'admin']), getOwnerStats);

module.exports = router;
