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
      'SELECT * FROM products WHERE is_featured = 1 ORDER BY display_order ASC, created_at DESC'
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
    const { title, price, old_price, is_new, is_featured, display_order } = req.body;

    if (!req.files || !req.files.image1) {
      return res.status(400).json({ success: false, message: 'image1 is required' });
    }

    const image1 = req.files.image1[0].filename;
    const image2 = req.files.image2 ? req.files.image2[0].filename : null;

    const [result] = await db.query(
      `INSERT INTO products (title, price, old_price, image1, image2, is_new, is_featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        price,
        old_price || null,
        image1,
        image2,
        is_new ? 1 : 0,
        is_featured !== undefined ? is_featured : 1,
        display_order || 0
      ]
    );

    res.status(201).json({ success: true, productId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error adding product' });
  }
};

// GET /api/products  (all products, for admin table view - includes non-featured too)
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products ORDER BY display_order ASC, created_at DESC'
    );

    const products = rows.map((p) => ({
      id: p.id,
      title: p.title,
      price: parseFloat(p.price),
      old_price: p.old_price ? parseFloat(p.old_price) : null,
      image1: `/uploads/${p.image1}`,
      image2: p.image2 ? `/uploads/${p.image2}` : null,
      is_new: p.is_new,
      is_featured: p.is_featured,
      display_order: p.display_order,
      badge: calculateBadge(parseFloat(p.price), p.old_price ? parseFloat(p.old_price) : null, p.is_new)
    }));

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

// GET /api/products/:id  (single product, for edit form pre-fill)
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const p = rows[0];
    res.json({
      success: true,
      product: {
        id: p.id,
        title: p.title,
        price: parseFloat(p.price),
        old_price: p.old_price ? parseFloat(p.old_price) : null,
        image1: `/uploads/${p.image1}`,
        image2: p.image2 ? `/uploads/${p.image2}` : null,
        is_new: p.is_new,
        is_featured: p.is_featured,
        display_order: p.display_order
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
};

// PUT /api/products/:id  (update product, images optional - only replace if new file sent)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, old_price, is_new, is_featured, display_order } = req.body;

    const [existingRows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const existing = existingRows[0];

    // Use new uploaded file if provided, else keep old filename
    const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : existing.image1;
    const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : existing.image2;

    await db.query(
      `UPDATE products
       SET title = ?, price = ?, old_price = ?, image1 = ?, image2 = ?, is_new = ?, is_featured = ?, display_order = ?
       WHERE id = ?`,
      [
        title,
        price,
        old_price || null,
        image1,
        image2,
        is_new ? 1 : 0,
        is_featured !== undefined ? is_featured : existing.is_featured,
        display_order !== undefined ? display_order : existing.display_order,
        id
      ]
    );

    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};

module.exports = {
  getFeaturedProducts,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
