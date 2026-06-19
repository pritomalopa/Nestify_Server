const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Paste your full Atlas connection string (SRV or standard) into MONGODB_URI.
    // dbName is passed separately so it works regardless of whether the URI
    // itself already includes a database path segment.
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(`MongoDB connected successfully (database: "${mongoose.connection.name}")`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
