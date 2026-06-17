const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Arubic backend running...');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
