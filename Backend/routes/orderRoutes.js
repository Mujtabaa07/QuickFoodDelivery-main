const express = require('express');
const { Order, Restaurant, User } = require('../models/associations');
const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      restaurant,
      items,
      subtotal,
      deliveryFee = 25,
      tax,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      customerName,
      customerPhone
    } = req.body;

    const order = new Order({
      customer,
      restaurant,
      items,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      customerName,
      customerPhone,
      estimatedDeliveryTime: 30,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid'
    });

    await order.save();

    // Update restaurant stats
    if (restaurant) {
      await Restaurant.findByIdAndUpdate(restaurant, {
        $inc: { todayOrders: 1, todayRevenue: totalAmount }
      });
    }

    await order.populate('restaurant customer');

    res.status(201).json({
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

// Get all orders (with filters)
router.get('/', async (req, res) => {
  try {
    const { customer, status, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (customer) {
      filter.customer = customer;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('restaurant', 'name image phone')
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('restaurant', 'name image phone address')
      .populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    ).populate('restaurant customer');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
