const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Studio', 'Cottage', 'Commercial'],
      required: true,
    },
    rent: { type: Number, required: true },
    rentType: { type: String, enum: ['Monthly', 'Weekly', 'Daily'], default: 'Monthly' },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    size: { type: String, default: '' }, // e.g. "1200 sqft"
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    extraFeatures: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    rejectionFeedback: { type: String, default: '' },
    ownerEmail: { type: String, required: true },
    ownerName: { type: String, required: true },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
