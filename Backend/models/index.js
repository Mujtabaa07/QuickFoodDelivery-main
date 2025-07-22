const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Import all models
const User = require('./User');
const Restaurant = require('./Restaurant');
const Category = require('./Category');
const Food = require('./Food');
const Order = require('./Order');

// Connect to database
connectDB();

module.exports = {
  User,
  Restaurant,
  Category,
  Food,
  Order
};
