const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import models to establish connections
require('./models/index');

// Import routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickFood API is running with MongoDB!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 QuickFood API server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:3000/admin`);
  console.log(`🍃 Using MongoDB Atlas database`);
});
