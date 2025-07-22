const express = require('express');
const { Order, Restaurant, User, Food } = require('../models/associations');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Middleware to authenticate admin
router.use(authenticateAdmin);

// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Yesterday's orders for comparison
    const yesterdayOrders = await Order.countDocuments({
      createdAt: { $gte: yesterday, $lt: today }
    });

    // Active restaurants
    const activeRestaurants = await Restaurant.countDocuments({
      status: 'Active'
    });

    const totalRestaurants = await Restaurant.countDocuments();

    // Total customers
    const totalCustomers = await User.countDocuments({
      role: 'customer'
    });

    // New customers today
    const newCustomersToday = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: today }
    });

    // Today's revenue
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Yesterday's revenue for comparison
    const yesterdayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].totalRevenue : 0;
    const yesterdayRevenue = yesterdayRevenueResult.length > 0 ? yesterdayRevenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('restaurant', 'name')
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    // Restaurant performance
    const restaurantStats = await Restaurant.find()
      .select('name rating status createdAt')
      .sort({ createdAt: -1 });

    // Calculate percentage changes
    const orderChange = yesterdayOrders > 0 ? 
      ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1) : 
      (todayOrders > 0 ? '+100' : '0');
    
    const revenueChange = yesterdayRevenue > 0 ? 
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : 
      (todayRevenue > 0 ? '+100' : '0');

    res.json({
      stats: {
        todayOrders: {
          value: todayOrders,
          change: `${orderChange >= 0 ? '+' : ''}${orderChange}%`
        },
        activeRestaurants: {
          value: activeRestaurants,
          change: `${totalRestaurants - activeRestaurants} inactive`
        },
        totalCustomers: {
          value: totalCustomers,
          change: `+${newCustomersToday} today`
        },
        todayRevenue: {
          value: todayRevenue,
          change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`
        }
      },
      recentOrders: recentOrders.map(order => ({
        id: order.orderId || order._id,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        restaurant: order.restaurant.name,
        amount: order.totalAmount,
        status: order.status,
        time: order.createdAt.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: order.createdAt.toLocaleDateString('en-IN')
      })),
      restaurants: restaurantStats.map(restaurant => ({
        id: restaurant._id,
        name: restaurant.name,
        rating: restaurant.rating || 0,
        status: restaurant.status,
        joinedDate: restaurant.createdAt.toLocaleDateString('en-IN')
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders with pagination and filtering
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('restaurant', 'name')
      .populate('customer', 'firstName lastName email phone')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      orders: orders.map(order => ({
        id: order._id,
        orderId: order.orderId || order._id,
        customer: {
          name: `${order.customer.firstName} ${order.customer.lastName}`,
          email: order.customer.email,
          phone: order.customer.phone
        },
        restaurant: order.restaurant.name,
        items: order.items.map(item => ({
          name: item.food.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('restaurant', 'name').populate('customer', 'firstName lastName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ 
      message: 'Order status updated successfully', 
      order: {
        id: order._id,
        status: order.status,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        restaurant: order.restaurant.name
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all restaurants with management options
router.get('/restaurants', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRestaurants = await Restaurant.countDocuments(filter);

    // Get order counts for each restaurant
    const restaurantStats = await Promise.all(
      restaurants.map(async (restaurant) => {
        const totalOrders = await Order.countDocuments({ restaurant: restaurant._id });
        const todayOrders = await Order.countDocuments({
          restaurant: restaurant._id,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        });

        return {
          id: restaurant._id,
          name: restaurant.name,
          email: restaurant.email,
          phone: restaurant.phone,
          address: restaurant.address,
          rating: restaurant.rating || 0,
          status: restaurant.status,
          totalOrders,
          todayOrders,
          createdAt: restaurant.createdAt,
          updatedAt: restaurant.updatedAt
        };
      })
    );

    res.json({
      restaurants: restaurantStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRestaurants / limit),
        totalRestaurants,
        hasNextPage: page < Math.ceil(totalRestaurants / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update restaurant status
router.patch('/restaurants/:restaurantId/status', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Active', 'Inactive', 'Suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ 
      message: 'Restaurant status updated successfully', 
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        status: restaurant.status
      }
    });
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's revenue
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Week's revenue
    const weekRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisWeek },
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Month's revenue
    const monthRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Performance metrics
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    
    const averageOrderValueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const todayRevenue = todayRevenueResult.length > 0 ? todayRevenueResult[0].totalRevenue : 0;
    const weekRevenue = weekRevenueResult.length > 0 ? weekRevenueResult[0].totalRevenue : 0;
    const monthRevenue = monthRevenueResult.length > 0 ? monthRevenueResult[0].totalRevenue : 0;
    const averageOrderValue = averageOrderValueResult.length > 0 ? averageOrderValueResult[0].avgValue : 0;

    res.json({
      revenue: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue
      },
      metrics: {
        successRate: totalOrders ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0,
        averageOrderValue: averageOrderValue.toFixed(2),
        totalOrders,
        deliveredOrders
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
