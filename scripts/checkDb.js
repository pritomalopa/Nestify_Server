
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');

const run = async () => {
  await connectDB();

  console.log('\n--- Nestify DB Diagnostic ---');
  console.log('Connected database name:', mongoose.connection.name);

  const userCount = await User.countDocuments();
  const users = await User.find().select('email role provider').limit(20);
  console.log(`\nUsers (${userCount} total):`);
  users.forEach((u) => console.log(`  - ${u.email}  role=${u.role}  provider=${u.provider}`));

  const propertyCount = await Property.countDocuments();
  const byStatus = await Property.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  console.log(`\nProperties (${propertyCount} total):`);
  byStatus.forEach((s) => console.log(`  - ${s._id}: ${s.count}`));

  const sample = await Property.find().select('title status ownerEmail propertyType rent').limit(10);
  console.log('\nSample properties:');
  sample.forEach((p) => console.log(`  - "${p.title}" [${p.status}] ${p.propertyType} $${p.rent} (owner: ${p.ownerEmail})`));

  console.log('\n--- End of diagnostic ---\n');
  console.log('If this shows 0 users even after registering on the website, OR 0 properties');
  console.log('even after running seedProperties.js, then your running `npm run dev` server');
  console.log('is reading a DIFFERENT .env than this script just did. Stop the dev server');
  console.log('completely (Ctrl+C) and start it again with `npm run dev` so it picks up the');
  console.log('current .env file.\n');

  await mongoose.connection.close();
  process.exit(0);
};

run();
