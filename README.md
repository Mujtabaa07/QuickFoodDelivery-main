# QuickFood Delivery Application

A full-stack food delivery application with MongoDB backend and Next.js frontend.

## 🚀 Quick Start

To run both backend and frontend simultaneously:

```bash
npm start
```

This will start:
- **Backend API** on `http://localhost:5000` (Express + MongoDB)
- **Frontend** on `http://localhost:3000` (Next.js)
- **Admin Dashboard** at `http://localhost:3000/admin`

## 📦 Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm start
   ```

## 🛠️ Available Scripts

- `npm start` - Run both backend and frontend in development mode
- `npm run dev` - Same as start (alias)
- `npm run prod` - Run both in production mode
- `npm run build` - Build the frontend for production
- `npm run build:all` - Install dependencies and build
- `npm run seed` - Seed the database with sample data
- `npm run dev:backend` - Run only backend in development
- `npm run dev:frontend` - Run only frontend in development

## 🗃️ Database

The application uses MongoDB Atlas cloud database. The connection is configured in `Backend/.env`.

### Seeding Data

To populate the database with sample restaurants, categories, and foods:

```bash
npm run seed
```

## 🏗️ Project Structure

```
QuickFoodDelivery/
├── Backend/                 # Express.js API server
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── config/             # Database configuration
│   └── seeders/            # Database seeding scripts
├── QuickFoodDelivery-main/ # Next.js frontend
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── context/            # React context providers
│   └── public/             # Static assets
└── package.json            # Root package.json with scripts
```

## 🔧 Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form handling

## 🚨 Development Notes

- The backend runs on port 5000
- The frontend runs on port 3000
- MongoDB connection is pre-configured with Atlas
- Both servers support hot-reload during development
- Use `npm start` to run both servers simultaneously

## 📝 Environment Variables

Backend environment variables are in `Backend/.env`:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)

## 🔐 Authentication

The application includes user authentication with JWT tokens. Admin functionality is available through the `/admin` route.

---

**Happy coding!** 🍕🚀
