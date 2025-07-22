const mongoose = require('mongoose');
require('dotenv').config();
const { Restaurant, Category, Food, User, Order } = require('../models/associations');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB');
    
    console.log('🌱 Starting MongoDB database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});
    await Order.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin users
    const admin1 = new User({
      firstName: 'Shifa',
      lastName: 'Admin',
      email: 'shifa@quickfood.com',
      phone: '+91 98765 43210',
      password: 'admin123',
      role: 'admin',
      address: 'Mandya, Karnataka'
    });
    await admin1.save();

    const admin2 = new User({
      firstName: 'Zeba',
      lastName: 'Admin',
      email: 'zeba@quickfood.com',
      phone: '+91 98765 43211',
      password: 'admin123',
      role: 'admin',
      address: 'Mandya, Karnataka'
    });
    await admin2.save();
    console.log('✅ Admin users created (Shifa & Zeba)');

    // Create sample customers
    const customers = [];
    const customerData = [
      { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', phone: '+91 87654 32109' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@gmail.com', phone: '+91 87654 32110' },
      { firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@gmail.com', phone: '+91 87654 32111' },
      { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@gmail.com', phone: '+91 87654 32112' },
      { firstName: 'Arjun', lastName: 'Patel', email: 'arjun.patel@gmail.com', phone: '+91 87654 32113' },
    ];

    for (const customerInfo of customerData) {
      const customer = new User({
        ...customerInfo,
        password: 'customer123',
        role: 'customer',
        address: 'Mandya, Karnataka'
      });
      customers.push(await customer.save());
    }
    console.log('✅ Sample customers created');

    // Create sample restaurants
    const restaurant1 = new Restaurant({
      name: 'Mandya Biryani Palace',
      cuisine: 'Indian',
      rating: 4.8,
      reviews: 450,
      deliveryTime: '25-35 min',
      deliveryFee: '₹25',
      image: '/images/restaurant-biryani.png',
      featured: true,
      location: 'Main Street',
      priceRange: '₹₹',
      address: '123 Main Street, Near City Center, Mandya, Karnataka 571401',
      phone: '+91 98765 43210',
      description: 'Authentic Mandya-style biryani and traditional South Indian dishes.',
      status: 'Active'
    });
    await restaurant1.save();

    const restaurant2 = new Restaurant({
      name: 'South Indian Express',
      cuisine: 'South Indian',
      rating: 4.5,
      reviews: 320,
      deliveryTime: '20-30 min',
      deliveryFee: '₹20',
      image: '/images/restaurant-south-indian.png',
      featured: true,
      location: 'MG Road',
      priceRange: '₹',
      address: '456 MG Road, Mandya, Karnataka 571401',
      phone: '+91 98765 43211',
      description: 'Fresh dosas, idli, and authentic South Indian breakfast.',
      status: 'Active'
    });
    await restaurant2.save();

    const restaurant3 = new Restaurant({
      name: 'North Indian Delights',
      cuisine: 'North Indian',
      rating: 4.6,
      reviews: 280,
      deliveryTime: '30-40 min',
      deliveryFee: '₹30',
      image: '/images/restaurant-north-indian.png',
      featured: false,
      location: 'Gandhi Nagar',
      priceRange: '₹₹₹',
      address: '789 Gandhi Nagar, Mandya, Karnataka 571401',
      phone: '+91 98765 43212',
      description: 'Rich North Indian curries, naan, and tandoor specialties.',
      status: 'Active'
    });
    await restaurant3.save();

    console.log('✅ Sample restaurants created');

    // Create categories for restaurant 1 (Biryani Palace)
    const category1_1 = new Category({
      name: 'Biryani & Rice',
      restaurant: restaurant1._id
    });
    await category1_1.save();

    const category1_2 = new Category({
      name: 'Starters',
      restaurant: restaurant1._id
    });
    await category1_2.save();

    const category1_3 = new Category({
      name: 'Desserts',
      restaurant: restaurant1._id
    });
    await category1_3.save();

    // Create categories for restaurant 2 (South Indian Express)
    const category2_1 = new Category({
      name: 'Breakfast',
      restaurant: restaurant2._id
    });
    await category2_1.save();

    const category2_2 = new Category({
      name: 'Rice Items',
      restaurant: restaurant2._id
    });
    await category2_2.save();

    // Create categories for restaurant 3 (North Indian Delights)
    const category3_1 = new Category({
      name: 'Curries',
      restaurant: restaurant3._id
    });
    await category3_1.save();

    const category3_2 = new Category({
      name: 'Breads',
      restaurant: restaurant3._id
    });
    await category3_2.save();

    console.log('✅ Categories created');

    // Create foods for Biryani Palace
    const foods1 = [
      {
        name: 'Mandya Special Biryani',
        description: 'Aromatic basmati rice with tender mutton and special Mandya spices',
        price: 249,
        image: '/images/mandya-special-biryani.png',
        veg: false,
        popular: true,
        rating: 4.8,
        category: category1_1._id,
        restaurant: restaurant1._id
      },
      {
        name: 'Chicken Biryani',
        description: 'Classic chicken biryani with fragrant rice and tender chicken',
        price: 199,
        image: '/images/chicken-biryani.png',
        veg: false,
        popular: true,
        rating: 4.7,
        category: category1_1._id,
        restaurant: restaurant1._id
      },
      {
        name: 'Veg Biryani',
        description: 'Aromatic vegetable biryani with mixed vegetables and basmati rice',
        price: 149,
        image: '/images/veg-biryani.png',
        veg: true,
        popular: false,
        rating: 4.5,
        category: category1_1._id,
        restaurant: restaurant1._id
      },
      {
        name: 'Chicken 65',
        description: 'Spicy and crispy chicken starter with special Mandya marinade',
        price: 179,
        image: '/images/chicken-65.png',
        veg: false,
        popular: true,
        rating: 4.6,
        category: category1_2._id,
        restaurant: restaurant1._id
      },
      {
        name: 'Gulab Jamun',
        description: 'Soft and sweet milk dumplings in sugar syrup',
        price: 89,
        image: '/images/gulab-jamun.png',
        veg: true,
        popular: false,
        rating: 4.4,
        category: category1_3._id,
        restaurant: restaurant1._id
      }
    ];

    await Food.insertMany(foods1);

    // Create foods for South Indian Express
    const foods2 = [
      {
        name: 'Masala Dosa',
        description: 'Crispy rice crepe filled with spiced potato curry',
        price: 89,
        image: '/images/masala-dosa.png',
        veg: true,
        popular: true,
        rating: 4.7,
        category: category2_1._id,
        restaurant: restaurant2._id
      },
      {
        name: 'Idli Sambar',
        description: 'Steamed rice cakes served with lentil curry and coconut chutney',
        price: 69,
        image: '/images/idli-sambar.png',
        veg: true,
        popular: true,
        rating: 4.6,
        category: category2_1._id,
        restaurant: restaurant2._id
      },
      {
        name: 'Bisi Bele Bath',
        description: 'Traditional Karnataka rice dish with lentils and vegetables',
        price: 99,
        image: '/images/bisi-bele-bath.png',
        veg: true,
        popular: false,
        rating: 4.5,
        category: category2_2._id,
        restaurant: restaurant2._id
      }
    ];

    await Food.insertMany(foods2);

    // Create foods for North Indian Delights
    const foods3 = [
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based chicken curry with rich butter sauce',
        price: 229,
        image: '/images/butter-chicken.png',
        veg: false,
        popular: true,
        rating: 4.8,
        category: category3_1._id,
        restaurant: restaurant3._id
      },
      {
        name: 'Dal Tadka',
        description: 'Yellow lentils tempered with spices and herbs',
        price: 129,
        image: '/images/dal-tadka.png',
        veg: true,
        popular: false,
        rating: 4.4,
        category: category3_1._id,
        restaurant: restaurant3._id
      },
      {
        name: 'Butter Naan',
        description: 'Soft leavened bread brushed with butter',
        price: 49,
        image: '/images/butter-naan.png',
        veg: true,
        popular: true,
        rating: 4.5,
        category: category3_2._id,
        restaurant: restaurant3._id
      }
    ];

    await Food.insertMany(foods3);
    console.log('✅ Sample foods created');

    // Create sample orders
    const orders = [];
    const statuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const paymentMethods = ['upi', 'card', 'netbanking', 'wallet', 'cod'];
    
    // Get all foods for creating order items
    const allFoods = await Food.find();
    const allRestaurants = await Restaurant.find();

    for (let i = 0; i < 20; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const restaurant = allRestaurants[Math.floor(Math.random() * allRestaurants.length)];
      const restaurantFoods = allFoods.filter(food => food.restaurant.toString() === restaurant._id.toString());
      
      if (restaurantFoods.length > 0) {
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const items = [];
        let subtotal = 0;

        for (let j = 0; j < numItems; j++) {
          const food = restaurantFoods[Math.floor(Math.random() * restaurantFoods.length)];
          const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
          const price = food.price;
          
          items.push({
            food: food._id,
            name: food.name,
            quantity,
            price,
            image: food.image
          });
          
          subtotal += price * quantity;
        }

        const deliveryFee = 25;
        const tax = Math.round(subtotal * 0.18); // 18% tax
        const totalAmount = subtotal + deliveryFee + tax;

        // Create order with varying dates (some today, some yesterday)
        const orderDate = new Date();
        if (Math.random() > 0.7) {
          orderDate.setDate(orderDate.getDate() - 1); // 30% yesterday
        }

        const order = new Order({
          orderId: `QF${String(123456 + i).padStart(6, '0')}`,
          customer: customer._id,
          restaurant: restaurant._id,
          items,
          subtotal,
          deliveryFee,
          tax,
          totalAmount,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          paymentStatus: Math.random() > 0.2 ? 'Paid' : 'Pending',
          deliveryAddress: {
            street: customer.address,
            city: 'Mandya',
            state: 'Karnataka',
            zipCode: '571401'
          },
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerPhone: customer.phone,
          createdAt: orderDate,
          updatedAt: orderDate
        });

        orders.push(await order.save());
      }
    }

    console.log('✅ Sample orders created');
    console.log('🎉 MongoDB database seeding completed successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

module.exports = seedData;

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}
