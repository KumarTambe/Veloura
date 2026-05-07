import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import products from './data/products.js';

dotenv.config();

// Fix for local DNS blocking SRV lookups (querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Order.deleteMany();
    await Product.deleteMany();
    // Don't delete users so we don't lose the one just created, or we can just delete it if we want.
    // We will leave users intact to preserve the user's new account.

    // Insert sample products
    await Product.insertMany(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Order.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
