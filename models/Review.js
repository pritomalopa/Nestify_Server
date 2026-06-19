const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle: { type: String, default: '' },
    tenantName: { type: String, required: true },
    tenantEmail: { type: String, required: true },
    tenantPhoto: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
