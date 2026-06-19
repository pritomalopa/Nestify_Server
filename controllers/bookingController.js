const Booking = require('../models/Booking');

// POST /bookings  - created only AFTER successful Stripe payment (called from client)
const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, paymentStatus: 'paid', bookingStatus: 'Pending' });
    res.status(201).send(booking);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create booking', error: error.message });
  }
};

// GET /bookings/tenant/:email
const getTenantBookings = async (req, res) => {
  const bookings = await Booking.find({ tenantEmail: req.params.email }).sort({ createdAt: -1 });
  res.send(bookings);
};

// GET /bookings/owner/:email  - booking requests for owner's properties
const getOwnerBookings = async (req, res) => {
  const bookings = await Booking.find({ ownerEmail: req.params.email }).sort({ createdAt: -1 });
  res.send(bookings);
};

// PATCH /bookings/status/:id  (owner approves/rejects)
const updateBookingStatus = async (req, res) => {
  const { bookingStatus } = req.body;
  const updated = await Booking.findByIdAndUpdate(req.params.id, { bookingStatus }, { new: true });
  res.send(updated);
};

// GET /bookings/admin/all (admin) - paginated
const getAllBookingsAdmin = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const total = await Booking.countDocuments();
  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.send({ bookings, total, totalPages: Math.ceil(total / limit), page });
};

// GET /bookings/transactions (admin) - only paid bookings, paginated
const getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const query = { paymentStatus: 'paid' };
  const total = await Booking.countDocuments(query);
  const transactions = await Booking.find(query)
    .select('transactionId propertyTitle tenantName ownerName amount createdAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.send({ transactions, total, totalPages: Math.ceil(total / limit), page });
};

// GET /bookings/stats/owner/:email  - earnings, totals, monthly chart data
const getOwnerStats = async (req, res) => {
  const email = req.params.email;

  const totalEarningsAgg = await Booking.aggregate([
    { $match: { ownerEmail: email, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalEarnings = totalEarningsAgg[0]?.total || 0;

  const totalBookings = await Booking.countDocuments({ ownerEmail: email, bookingStatus: 'Approved' });

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const monthlyAgg = await Booking.aggregate([
    {
      $match: {
        ownerEmail: email,
        paymentStatus: 'paid',
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyEarnings = monthlyAgg.map((m) => ({
    month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
    earnings: m.total,
  }));

  res.send({ totalEarnings, totalBookings, monthlyEarnings });
};

module.exports = {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookingsAdmin,
  getTransactions,
  getOwnerStats,
};
