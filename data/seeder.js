require('dotenv').config({ path: __dirname + '/../.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Product = require('../models/Product');

const products = JSON.parse(fs.readFileSync(__dirname + '/products.json', 'utf-8'));

async function truncate() {
  console.log('Deleting all data...');
  await Product.remove();
  console.log('Done');
  process.exit();
}

async function seed() {
  try {
    await Product.insertMany(products);
    console.log('Done');
    process.exit();
  } catch(e) {
    console.log('Error seeding data, try to dump everyting first.');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  truncate();
} else {
  seed();
}
