const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Place an order
router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json({ message: 'Order placed!', order });
});

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

module.exports = router;
