const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // not set for social-login users
    photo: { type: String, default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&q=80' },
    role: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    provider: { type: String, enum: ['password', 'google'], default: 'password' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
