const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const {
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
} = require('../controllers/propertyController');

// Public
router.get('/', getApprovedProperties);
router.get('/featured', getFeaturedProperties);
router.get('/search-meta', getSearchMeta);

// Admin
router.get('/admin/all', verifyToken, verifyRole(['admin']), getAllPropertiesAdmin);
router.patch('/status/:id', verifyToken, verifyRole(['admin']), updatePropertyStatus);

// Owner
router.get('/owner/:email', verifyToken, verifyRole(['owner', 'admin']), getOwnerProperties);
router.post('/', verifyToken, verifyRole(['owner']), addProperty);
router.patch('/:id', verifyToken, verifyRole(['owner', 'admin']), updateProperty);
router.delete('/:id', verifyToken, verifyRole(['owner', 'admin']), deleteProperty);

// Private (any logged-in user) - must be after the more specific routes above
router.get('/:id', verifyToken, getPropertyById);

module.exports = router;
