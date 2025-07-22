'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Star, Truck, ChefHat, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import { restaurantAPI } from "@/lib/api"

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  isOpen: boolean;
  location?: string;
  deliveryFee?: string;
  featured?: boolean;
}

const categories = [
  { name: "Biryani", icon: "🍛", count: 25, color: "bg-red-100" },
  { name: "Dosa & Idli", icon: "🥞", count: 18, color: "bg-orange-100" },
  { name: "North Indian", icon: "🍜", count: 22, color: "bg-yellow-100" },
  { name: "Street Food", icon: "🥘", count: 15, color: "bg-green-100" },
  { name: "Sweets", icon: "🍮", count: 12, color: "bg-pink-100" },
  { name: "Beverages", icon: "🥤", count: 10, color: "bg-blue-100" },
]

export default function HomePage() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedRestaurants()
  }, [])

  const fetchFeaturedRestaurants = async () => {
    try {
      const data = await restaurantAPI.getAll()
      // Take first 6 restaurants as featured
      setFeaturedRestaurants((data.restaurants || data).slice(0, 6))
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="h-12 w-12 text-red-200 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Hungry?</span>
              <span className="block text-4xl md:text-5xl text-red-200">Order from QuickFood!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Mandya's most delicious food delivered instantly • Fresh • Fast • Delicious
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    placeholder="Search your favorite food..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-semibold">
                  Find Food
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What's for dinner today?</h2>
            <p className="text-xl text-gray-600">Choose from our delicious categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/restaurants?category=${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 hover:border-red-200">
                  <CardContent className={`p-6 text-center ${category.color} hover:bg-opacity-80`}>
                    <div className="text-5xl mb-3">{category.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Top Restaurants in Mandya</h2>
              <p className="text-xl text-gray-600">Curated by Admins</p>
            </div>
            <Link href="/restaurants">
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                View All Restaurants
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`}>
                <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 border-2 hover:border-red-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={restaurant.image || "/placeholder.svg?height=200&width=300&query=Indian restaurant exterior"}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    {restaurant.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white">
                        ⭐ Featured
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
                    <p className="text-xs text-red-600 mb-3 font-medium">📍 {restaurant.location}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 font-medium">
                        <Truck className="h-4 w-4" />
                        <span>{restaurant.deliveryFee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose QuickFood */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuickFood?</h2>
            <p className="text-xl text-gray-600">Your trusted food delivery partner in Mandya</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Fresh and hot food delivered to your home in 20-30 minutes
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">
                Admins personally ensures quality and hygiene of every restaurant
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Live Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Know where your food is with real-time tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-800 to-red-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-2xl font-bold">QuickFood</span>
              </div>
              <p className="text-red-200 mb-4">
                Mandya's #1 food delivery app. Fresh, fast, and delicious food with just one click!
              </p>
              <p className="text-sm text-red-300">Managed by Admins</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-2 text-red-200">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About QuickFood
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Join Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-2 text-red-200">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-red-200 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-red-200 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-red-200 hover:text-white transition-colors">
                  WhatsApp
                </a>
              </div>
              <p className="text-sm text-red-300">📞 Customer Care: +91 98765 43210</p>
            </div>
          </div>
          <div className="border-t border-red-700 mt-8 pt-8 text-center text-red-200">
            <p>&copy; 2024 QuickFood Mandya. All rights reserved. | Admins</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
