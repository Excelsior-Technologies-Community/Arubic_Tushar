const pool = require('../config/db');

// ── existing: GET /api/products/featured ─────────────────────
const getFeaturedProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── updated: GET /api/products ────────────────────────────────
// Now supports query params for Women page filtering:
//   ?category=dresses&composition=Cotton&style=Casual&property=Short+Dress
//   &price_min=15&price_max=30&sort=price-asc&page=1&limit=12
const getAllProducts = async (req, res) => {
  try {
    const {
      category, composition, style, property,
      price_min, price_max,
      sort  = '',
      page  = 1,
      limit = 12,
    } = req.query;

    // Build WHERE clause dynamically
    const where  = ['p.is_active = 1'];
    const params = [];

    if (category)    { where.push('p.category = ?');    params.push(category); }
    if (composition) { where.push('p.composition = ?'); params.push(composition); }
    if (style)       { where.push('p.style = ?');       params.push(style); }
    if (property)    { where.push('p.property = ?');    params.push(property); }
    if (price_min)   { where.push('p.price >= ?');      params.push(Number(price_min)); }
    if (price_max)   { where.push('p.price <= ?');      params.push(Number(price_max)); }

    const whereClause = 'WHERE ' + where.join(' AND ');

    // Sort mapping
    const sortMap = {
      'price-asc':  'p.price ASC',
      'price-desc': 'p.price DESC',
      'name-asc':   'p.name ASC',
      'name-desc':  'p.name DESC',
    };
    const orderBy = 'ORDER BY ' + (sortMap[sort] || 'p.id ASC');

    // Total count for pagination
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );

    // Paginated data
    const offset     = (Number(page) - 1) * Number(limit);
    const [products] = await pool.query(
      `SELECT * FROM products p ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── existing: GET /api/products/:id ──────────────────────────
const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── existing: POST /api/products ─────────────────────────────
const addProduct = async (req, res) => {
  try {
    const {
      name, price, old_price, category,
      composition, style, property,
      badge, badge_type, rating,
    } = req.body;

    if (!name || !price || !category)
      return res.status(400).json({ success: false, message: 'name, price, category required' });

    const image1 = req.files?.image1?.[0]?.filename || null;
    const image2 = req.files?.image2?.[0]?.filename || null;
    const img_url = image1 ? `/uploads/${image1}` : req.body.img_url || null;

    const [result] = await pool.query(
      `INSERT INTO products
        (name, price, old_price, category, composition, style, property, badge, badge_type, rating, img_url, image1, image2)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, price, old_price || null, category,
        composition || null, style || null, property || null,
        badge || null, badge_type || null, rating || 5, img_url, image1, image2,
      ]
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Product created', data: newProduct[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── existing: PUT /api/products/:id ──────────────────────────
const updateProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const ex = existing[0];
    const {
      name, price, old_price, category,
      composition, style, property,
      badge, badge_type, rating, is_active,
    } = req.body;

    const image1 = req.files?.image1?.[0]?.filename || ex.image1;
    const image2 = req.files?.image2?.[0]?.filename || ex.image2;
    const img_url = req.files?.image1?.[0]
      ? `/uploads/${req.files.image1[0].filename}`
      : req.body.img_url || ex.img_url;

    await pool.query(
      `UPDATE products SET
        name = ?, price = ?, old_price = ?, category = ?,
        composition = ?, style = ?, property = ?,
        badge = ?, badge_type = ?, rating = ?,
        img_url = ?, image1 = ?, image2 = ?, is_active = ?
       WHERE id = ?`,
      [
        name        || ex.name,
        price       || ex.price,
        old_price   !== undefined ? old_price   : ex.old_price,
        category    || ex.category,
        composition !== undefined ? composition : ex.composition,
        style       !== undefined ? style       : ex.style,
        property    !== undefined ? property    : ex.property,
        badge       !== undefined ? badge       : ex.badge,
        badge_type  !== undefined ? badge_type  : ex.badge_type,
        rating      || ex.rating,
        img_url,
        image1,
        image2,
        is_active   !== undefined ? is_active   : ex.is_active,
        req.params.id,
      ]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product updated', data: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── existing: DELETE /api/products/:id (soft delete) ─────────
const deleteProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length)
      return res.status(404).json({ success: false, message: 'Product not found' });

    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── new: GET /api/products/filters ───────────────────────────
// Returns unique values + counts for sidebar filter options
const getFilters = async (req, res) => {
  try {
    const [categories]   = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM products WHERE is_active = 1
       GROUP BY category ORDER BY category`
    );
    const [compositions] = await pool.query(
      `SELECT composition, COUNT(*) as count
       FROM products WHERE is_active = 1 AND composition IS NOT NULL
       GROUP BY composition ORDER BY composition`
    );
    const [styles]       = await pool.query(
      `SELECT style, COUNT(*) as count
       FROM products WHERE is_active = 1 AND style IS NOT NULL
       GROUP BY style ORDER BY style`
    );
    const [properties]   = await pool.query(
      `SELECT property, COUNT(*) as count
       FROM products WHERE is_active = 1 AND property IS NOT NULL
       GROUP BY property ORDER BY property`
    );

    res.json({
      success: true,
      data: { categories, compositions, styles, properties },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getFeaturedProducts,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getFilters,
};
