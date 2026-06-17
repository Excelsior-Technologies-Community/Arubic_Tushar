const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { getFeaturedProducts, addProduct } = require('../controllers/productController');

router.get('/featured', getFeaturedProducts);

// POST add new product (admin panel use later)
router.post('/', upload, addProduct);

module.exports = router;
