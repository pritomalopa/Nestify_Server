const Property = require('../models/Property');

// GET /properties  (public) - only Approved, supports search/filter/sort/pagination
const getApprovedProperties = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query;

    const query = { status: 'Approved' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (propertyType) query.propertyType = propertyType;
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = Number(minPrice);
      if (maxPrice) query.rent.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { rent: 1 };
    if (sort === 'price-desc') sortOption = { rent: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.send({ properties, total, totalPages: Math.ceil(total / limitNum), page: pageNum });
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch properties', error: error.message });
  }
};

// GET /properties/featured (public) - 6 approved properties for homepage
const getFeaturedProperties = async (req, res) => {
  const properties = await Property.find({ status: 'Approved' }).sort({ createdAt: -1 }).limit(6);
  res.send(properties);
};

// GET /properties/search-meta (public) - distinct locations & types, plus price range, for search/filter UI
const getSearchMeta = async (req, res) => {
  const locations = await Property.distinct('location', { status: 'Approved' });
  const types = await Property.distinct('propertyType', { status: 'Approved' });

  const priceStats = await Property.aggregate([
    { $match: { status: 'Approved' } },
    { $group: { _id: null, minPrice: { $min: '$rent' }, maxPrice: { $max: '$rent' } } },
  ]);

  res.send({
    locations,
    types,
    minPrice: priceStats[0]?.minPrice ?? null,
    maxPrice: priceStats[0]?.maxPrice ?? null,
  });
};

// GET /properties/:id (private - logged in users only, enforced by route middleware)
const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).send({ message: 'Property not found' });
  res.send(property);
};

// POST /properties (owner only)
const addProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, status: 'Pending' });
    res.status(201).send(property);
  } catch (error) {
    res.status(500).send({ message: 'Failed to add property', error: error.message });
  }
};

// GET /properties/owner/:email (owner only) - with pagination
const getOwnerProperties = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const query = { ownerEmail: req.params.email };
  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.send({ properties, total, totalPages: Math.ceil(total / limit), page });
};

// PATCH /properties/:id (owner updates own listing)
const updateProperty = async (req, res) => {
  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    { ...req.body, status: 'Pending', rejectionFeedback: '' }, // edits go back to pending review
    { new: true }
  );
  res.send(updated);
};

// DELETE /properties/:id (owner or admin)
const deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.send({ message: 'Property deleted' });
};

// GET /properties/admin/all (admin only) - all statuses, paginated
const getAllPropertiesAdmin = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const query = status ? { status } : {};
  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.send({ properties, total, totalPages: Math.ceil(total / limit), page });
};

// PATCH /properties/status/:id (admin only) - approve / reject with optional feedback
const updatePropertyStatus = async (req, res) => {
  const { status, rejectionFeedback } = req.body;
  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    { status, rejectionFeedback: status === 'Rejected' ? rejectionFeedback || '' : '' },
    { new: true }
  );
  res.send(updated);
};

module.exports = {
  getApprovedProperties,
  getFeaturedProperties,
  getSearchMeta,
  getPropertyById,
  addProperty,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  getAllPropertiesAdmin,
  updatePropertyStatus,
};
