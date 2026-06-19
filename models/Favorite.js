const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenantEmail: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, default: '' },
    location: { type: String, default: '' },
    rent: { type: Number, default: 0 },
    rentType: { type: String, default: 'Monthly' },
    status: { type: String, default: 'Approved' },
  },
  { timestamps: true }
);

favoriteSchema.index({ propertyId: 1, tenantEmail: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
