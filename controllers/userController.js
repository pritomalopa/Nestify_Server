const User = require('../models/User');

// GET /users/role/:email  (used by client to know the logged-in user's role)
const getUserRole = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send({ role: user.role });
};

// GET /users/:email (profile)
const getUserByEmail = async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select('-password');
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send(user);
};

// PATCH /users/:email (update profile)
const updateUser = async (req, res) => {
  const { name, photo, phone, address } = req.body;
  const updated = await User.findOneAndUpdate(
    { email: req.params.email },
    { $set: { name, photo, phone, address } },
    { new: true }
  ).select('-password');
  res.send(updated);
};

// GET /users  (admin only) - supports pagination & search by name/email
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.send({ users, total, totalPages: Math.ceil(total / limit), page });
};

// PATCH /users/role/:id (admin only)
const changeUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['tenant', 'owner', 'admin'].includes(role)) {
    return res.status(400).send({ message: 'Invalid role' });
  }
  const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  res.send(updated);
};

module.exports = { getUserRole, getUserByEmail, updateUser, getAllUsers, changeUserRole };
