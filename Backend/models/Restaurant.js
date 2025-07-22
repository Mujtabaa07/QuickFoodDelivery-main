const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    trim: true
  },
  deliveryFee: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  priceRange: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  todayOrders: {
    type: Number,
    default: 0
  },
  todayRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
