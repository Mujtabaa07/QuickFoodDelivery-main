# QuickFood Delivery Backend Setup Guide

## 🚀 Complete MongoDB Backend Implementation

Your backend has been completely restructured to use MongoDB Atlas with Mongoose. Here's what's been implemented:

### ✅ What's Been Implemented

1. **MongoDB Integration**
   - Switched from MySQL/Sequelize to MongoDB/Mongoose
   - Cloud-based MongoDB Atlas connection
   - Document-based data modeling

2. **User Authentication System**
   - User registration and login with MongoDB
   - JWT token-based authentication
   - Role-based access (customer/admin)
   - Password hashing with bcrypt

3. **Complete Database Models (Mongoose)**
   - User schema with authentication
   - Restaurant schema with ratings and stats
   - Category schema for food categorization
   - Enhanced Food schema with ratings and availability
   - Comprehensive Order schema with status tracking

4. **API Routes (MongoDB Compatible)**
   - `/api/auth` - Authentication (login/register)
   - `/api/restaurants` - Restaurant management
   - `/api/foods` - Food items with filtering
   - `/api/orders` - Order placement and tracking
   - `/api/admin` - Admin dashboard with analytics

5. **MongoDB Features**
   - Document relationships using ObjectId references
   - Mongoose populate for joining data
   - Aggregation pipelines for analytics
   - Flexible schema design

## 🛠️ Setup Instructions

### 1. MongoDB Atlas Connection
Your backend is configured to connect to MongoDB Atlas:
```
mongodb+srv://foodorder:78sPAIjt28uvI28v@cluster0.hxmf0z6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Install Dependencies
```bash
cd Backend
npm install
```

### 3. Environment Variables
Your `.env` file is configured:
```
MONGODB_URI=mongodb+srv://foodorder:78sPAIjt28uvI28v@cluster0.hxmf0z6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_quickfood_2025
NODE_ENV=development
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (Admin)
- `PUT /api/restaurants/:id` - Update restaurant

### Foods
- `GET /api/foods` - Get all foods with filtering
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Add new food item
- `PUT /api/foods/:id` - Update food item
- `DELETE /api/foods/:id` - Delete food item

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get orders with filtering
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Revenue analytics

## 🔧 Query Parameters

### Foods API
```
GET /api/foods?restaurant=RESTAURANT_ID&category=CATEGORY_ID&popular=true&veg=true
```

### Orders API
```
GET /api/orders?customer=CUSTOMER_ID&status=Delivered&page=1&limit=10
```

### Restaurants API
```
GET /api/restaurants?featured=true&search=biryani
```

## 👤 Sample Users (After Seeding)

**Admin:**
- Email: zeba.athiya@quickfood.com
- Password: admin123

**Customer:**
- Email: john.doe@gmail.com
- Password: customer123

## 🍽️ Sample Data

The seeder creates:
- 3 restaurants with different cuisines
- Multiple categories per restaurant
- Various food items with ratings
- Sample users (admin and customer)

## 🔒 Authentication Usage

Include JWT token in headers:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 🎯 Frontend Integration

Your frontend can now connect to:
- `http://localhost:5000/api/auth/login`
- `http://localhost:5000/api/restaurants`
- `http://localhost:5000/api/foods`
- `http://localhost:5000/api/orders`
- `http://localhost:5000/api/admin/dashboard/stats`

## 📈 Admin Dashboard Data

The admin routes provide real-time data using MongoDB aggregation:
- Today's orders count
- Active restaurants count
- Total customers
- Today's revenue
- Recent orders list
- Restaurant performance metrics

## 🔄 Order Status Flow

Orders progress through these statuses:
1. Confirmed
2. Preparing
3. Ready
4. Out for Delivery
5. Delivered
6. Cancelled (if needed)

## 🍃 MongoDB Features Used

1. **Document References**: Using ObjectId for relationships
2. **Populate**: Joining related documents
3. **Aggregation**: Complex queries for analytics
4. **Indexing**: Automatic indexing on _id fields
5. **Validation**: Mongoose schema validation
6. **Middleware**: Pre/post hooks for password hashing

## 🚨 Troubleshooting

1. **MongoDB Connection Failed**
   - Check internet connection
   - Verify MongoDB Atlas credentials
   - Ensure IP whitelist includes your IP

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process on port 5000

3. **Authentication Errors**
   - Check MongoDB Atlas username/password
   - Verify database permissions

## 🎉 Next Steps

1. Run `npm install` to install MongoDB dependencies
2. Run `npm run dev` to start the server
3. Test API endpoints
4. Run `npm run seed` for sample data
5. Connect your frontend to the backend
6. Test the complete application

## 🔄 Migration Notes

**Changes from MySQL to MongoDB:**
- Replaced Sequelize with Mongoose
- Changed from SQL tables to MongoDB collections
- Updated all model relationships to use ObjectId references
- Modified queries to use MongoDB syntax
- Updated aggregation queries for analytics

Your backend is now fully functional with MongoDB and ready to support all the features shown in your frontend!
