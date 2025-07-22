const express = require('express');
const cors = require('cors');
const sequelize = require('./models'); // Connects to DB via models/index.js
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Sync Sequelize models and start the server
sequelize.sync({ force: false })
  .then(() => {
    console.log('📦 Tables synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });
