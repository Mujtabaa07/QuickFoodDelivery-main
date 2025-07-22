const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all foods
router.get('/', async (req, res) => {
  const foods = await Food.findAll();
  res.json(foods);
});

// Add new food
router.post('/', async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json(food);
});

module.exports = router;
