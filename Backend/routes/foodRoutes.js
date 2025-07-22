const express = require('express');
const router = express.Router();
const { Food, Restaurant, Category } = require('../models/associations');

// Get all foods
router.get('/', async (req, res) => {
  try {
    const { restaurant, category, popular, veg } = req.query;
    let filter = {};

    if (restaurant) {
      filter.restaurant = restaurant;
    }

    if (category) {
      filter.category = category;
    }

    if (popular === 'true') {
      filter.popular = true;
    }

    if (veg === 'true') {
      filter.veg = true;
    }

    const foods = await Food.find(filter)
      .populate('restaurant', 'name image')
      .populate('category', 'name')
      .sort({ rating: -1 });

    res.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurant', 'name image rating deliveryTime')
      .populate('category', 'name');

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new food
router.post('/', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    await food.populate('restaurant category');
    res.status(201).json(food);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food
router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurant category');

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
