const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const {
  getFeaturedProducts,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET featured products (for the React Featured Products section)
router.get('/featured', getFeaturedProducts);

// GET all products (for admin table view)
router.get('/', getAllProducts);

// GET single product (for edit form pre-fill)
router.get('/:id', getProductById);

// POST add new product
router.post('/', upload, addProduct);

// PUT update product
router.put('/:id', upload, updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;
