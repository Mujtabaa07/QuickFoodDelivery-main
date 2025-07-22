const express = require('express');
const { Restaurant, Category, Food } = require('../models/associations');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { featured, category, search } = req.query;
    let filter = {};

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1 });

    res.json({ 
      success: true,
      count: restaurants.length,
      restaurants 
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid restaurant ID format' 
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: 'Restaurant not found' 
      });
    }

    // Get categories and foods for this restaurant
    let categories = [];
    try {
      categories = await Category.find({ restaurant: id });
    } catch (categoryError) {
      console.error('Error fetching categories:', categoryError);
      // Continue without categories if there's an error
    }

    res.json({
      success: true,
      ...restaurant.toObject(),
      categories
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create restaurant (Admin only)
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
