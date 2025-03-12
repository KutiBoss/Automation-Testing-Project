const Product = require('../models/product');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

const products = [
  {
    imagePath: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Icon_-_Happy_large.png?v=1571606093',
    title: 'Happy',
    description: 'Happy sticker!',
    price: 5.5
  },
  {
    imagePath: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Very_Angry_Emoji_7f7bb8df-d9dc-4cda-b79f-5453e764d4ea_large.png?v=1480481058',
    title: 'Angry',
    description: 'Angry sticker',
    price: 4.5
  },
  {
    imagePath: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Emoji_Icon_-_Sad_Emoji_large.png?v=1513251055',
    title: 'Sad',
    description: 'Sad sticker',
    price: 7
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Database seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
