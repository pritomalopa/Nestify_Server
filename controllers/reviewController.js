const Review = require('../models/Review');
const Property = require('../models/Property');

// POST /reviews (tenant only)
const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);

    // recalculate property's average rating
    const reviews = await Review.find({ propertyId: req.body.propertyId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Property.findByIdAndUpdate(req.body.propertyId, {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.status(201).send(review);
  } catch (error) {
    res.status(500).send({ message: 'Failed to add review', error: error.message });
  }
};

// GET /reviews/property/:propertyId
const getPropertyReviews = async (req, res) => {
  const reviews = await Review.find({ propertyId: req.params.propertyId }).sort({ createdAt: -1 });
  res.send(reviews);
};

// GET /reviews/top  (public) - top rated reviews for homepage
const getTopReviews = async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } }).sort({ rating: -1, createdAt: -1 }).limit(4);
  res.send(reviews);
};

module.exports = { addReview, getPropertyReviews, getTopReviews };
