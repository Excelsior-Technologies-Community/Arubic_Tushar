const db = require('../config/db');

// Helper: calculate badge from price/old_price/is_new
const calculateBadge = (price, old_price, is_new) => {
  if (old_price && old_price > price) {
    const percent = Math.round(((old_price - price) / old_price) * 100);
    return { type: 'discount', label: `-${percent}%` };
  }
  if (is_new) {
    return { type: 'new', label: 'new' };
  }
  return null; // no badge
};

// GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE is_featured = 1 ORDER BY created_at DESC'
    );

    const products = rows.map((p) => ({
      id: p.id,
      title: p.title,
      price: parseFloat(p.price),
      old_price: p.old_price ? parseFloat(p.old_price) : null,
      image1: `/uploads/${p.image1}`,
      image2: p.image2 ? `/uploads/${p.image2}` : `/uploads/${p.image1}`,
      badge: calculateBadge(parseFloat(p.price), p.old_price ? parseFloat(p.old_price) : null, p.is_new)
    }));

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

// POST /api/products  (add new product with image upload)
const addProduct = async (req, res) => {
  try {
    const { title, price, old_price, is_new, is_featured } = req.body;

    if (!req.files || !req.files.image1) {
      return res.status(400).json({ success: false, message: 'image1 is required' });
    }

    const image1 = req.files.image1[0].filename;
    const image2 = req.files.image2 ? req.files.image2[0].filename : null;

    const [result] = await db.query(
      `INSERT INTO products (title, price, old_price, image1, image2, is_new, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        price,
        old_price || null,
        image1,
        image2,
        is_new ? 1 : 0,
        is_featured !== undefined ? is_featured : 1
      ]
    );

    res.status(201).json({ success: true, productId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error adding product' });
  }
};

module.exports = { getFeaturedProducts, addProduct };
