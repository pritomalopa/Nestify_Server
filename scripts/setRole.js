
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
