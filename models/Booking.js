const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle: { type: String, required: true },
    propertyImage: { type: String, default: '' },
    propertyLocation: { type: String, default: '' },
    ownerEmail: { type: String, required: true },
    ownerName: { type: String, default: '' },
    tenantEmail: { type: String, required: true },
    tenantName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    moveInDate: { type: String, required: true },
    additionalNotes: { type: String, default: '' },
    amount: { type: Number, required: true },
    bookingStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    transactionId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
