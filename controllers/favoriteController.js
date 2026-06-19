const Favorite = require('../models/Favorite');

// POST /favorites
const addFavorite = async (req, res) => {
  try {
    const exists = await Favorite.findOne({ propertyId: req.body.propertyId, tenantEmail: req.body.tenantEmail });
    if (exists) return res.status(409).send({ message: 'Already in favorites' });

    const favorite = await Favorite.create(req.body);
    res.status(201).send(favorite);
  } catch (error) {
    res.status(500).send({ message: 'Failed to add favorite', error: error.message });
  }
};

// GET /favorites/:email
const getFavoritesByEmail = async (req, res) => {
  const favorites = await Favorite.find({ tenantEmail: req.params.email }).sort({ createdAt: -1 });
  res.send(favorites);
};

// DELETE /favorites/:id
const removeFavorite = async (req, res) => {
  await Favorite.findByIdAndDelete(req.params.id);
  res.send({ message: 'Removed from favorites' });
};

module.exports = { addFavorite, getFavoritesByEmail, removeFavorite };
