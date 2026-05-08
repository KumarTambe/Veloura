import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Fetch all products with search, filter, sort
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, sort } = req.query;

  // Build filter object
  const filter = {};

  // Search by name or description (case-insensitive)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by category
  if (category) {
    filter.category = category;
  }

  // Filter by brand
  if (brand) {
    filter.brand = brand;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Build sort object
  let sortOption = {};
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'name_asc':
      sortOption = { name: 1 };
      break;
    case 'name_desc':
      sortOption = { name: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const products = await Product.find(filter).sort(sortOption);

  // Also return distinct categories and brands for filter dropdowns
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');

  res.json({ products, categories, brands });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById };
