
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Property = require('../models/Property');

const [, , ownerEmail, ownerName] = process.argv;


const sampleProperties = [
  {
    title: 'Riverside 2-Bed Apartment in Gulshan',
    description:
      'A bright, modern apartment overlooking Gulshan Lake with two spacious bedrooms, an open-plan kitchen, and a quiet balcony perfect for morning tea.',
    location: 'Gulshan, Dhaka',
    propertyType: 'Apartment',
    rent: 650,
    rentType: 'Monthly',
    bedrooms: 2,
    bathrooms: 2,
    size: '1200 sqft',
    amenities: ['Wifi', 'Air Conditioning', 'Parking', 'Security', 'Elevator'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
  {
    title: 'Cozy Studio Near Dhanmondi Lake',
    description:
      'A compact, fully-furnished studio ideal for students or young professionals, just a five-minute walk from Dhanmondi Lake.',
    location: 'Dhanmondi, Dhaka',
    propertyType: 'Studio',
    rent: 280,
    rentType: 'Monthly',
    bedrooms: 1,
    bathrooms: 1,
    size: '450 sqft',
    amenities: ['Wifi', 'Furnished', '24/7 Water Supply'],
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
  {
    title: 'Hillside Cottage Retreat in Sylhet',
    description:
      'A peaceful cottage surrounded by tea gardens, offering panoramic hill views and a private garden — a perfect weekend getaway.',
    location: 'Sylhet',
    propertyType: 'Cottage',
    rent: 90,
    rentType: 'Daily',
    bedrooms: 2,
    bathrooms: 1,
    size: '900 sqft',
    amenities: ['Parking', 'Pet Friendly', 'Balcony'],
    images: [
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
  {
    title: "Beachfront Villa in Cox's Bazar",
    description:
      "A spacious villa just steps from the sand, with four bedrooms, a private terrace, and uninterrupted views of the Bay of Bengal.",
    location: "Cox's Bazar",
    propertyType: 'Villa',
    rent: 220,
    rentType: 'Daily',
    bedrooms: 4,
    bathrooms: 3,
    size: '2600 sqft',
    amenities: ['Wifi', 'Air Conditioning', 'Swimming Pool', 'Security', 'Parking'],
    images: [
      'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
  {
    title: 'Family House in Chattogram',
    description:
      'A comfortable three-bedroom family house with a private yard, located in a calm residential neighbourhood close to schools and markets.',
    location: 'Chattogram',
    propertyType: 'House',
    rent: 480,
    rentType: 'Monthly',
    bedrooms: 3,
    bathrooms: 2,
    size: '1800 sqft',
    amenities: ['Parking', 'Generator Backup', 'Security'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
  {
    title: 'Modern Office Space in Banani',
    description:
      'A street-facing commercial unit suitable for a small office or boutique shop, with good foot traffic and easy access to main roads.',
    location: 'Banani, Dhaka',
    propertyType: 'Commercial',
    rent: 700,
    rentType: 'Monthly',
    bedrooms: 0,
    bathrooms: 1,
    size: '600 sqft',
    amenities: ['Air Conditioning', 'Generator Backup', 'Parking'],
    images: [
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    ],
  },
];

const run = async () => {
  if (!ownerEmail || !ownerName) {
    console.log('Usage: node scripts/seedProperties.js <ownerEmail> "<ownerName>"');
    process.exit(1);
  }
  await connectDB();
  const docs = sampleProperties.map((p) => ({
    ...p,
    ownerEmail,
    ownerName,
    status: 'Approved',
  }));
  await Property.insertMany(docs);
  console.log(`✓ Inserted ${docs.length} sample Approved properties for ${ownerEmail}.`);
  await mongoose.connection.close();
  process.exit(0);
};

run();
