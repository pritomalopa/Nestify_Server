/**
 * One-time bootstrap utility: promotes an already-registered user to 'owner' or 'admin'.
 *
 * Why this exists: Nestify's UI never lets anyone choose their own role (every signup,
 * including Google, becomes a 'tenant' on purpose). So to get your first Owner or Admin
 * account, you register normally through the website and then run this script once to
 * upgrade that account's role directly in the database.
 *
 * Usage (run from inside the /server folder):
 *   node scripts/setRole.js owner@nestify.com owner
 *   node scripts/setRole.js admin@nestify.com admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const [, , email, role] = process.argv;

const run = async () => {
  if (!email || !role) {
    console.log('Usage: node scripts/setRole.js <email> <tenant|owner|admin>');
    process.exit(1);
  }

  if (!['tenant', 'owner', 'admin'].includes(role)) {
    console.log('Role must be one of: tenant, owner, admin');
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

  if (!user) {
    console.log(`No user found with email "${email}". Make sure you registered this account on the website first.`);
  } else {
    console.log(`Success! ${user.email} is now role: ${user.role}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run();
