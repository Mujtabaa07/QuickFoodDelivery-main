"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Star, Truck, ChefHat } from "lucide-react"
import Link from "next/link"
import { allRestaurants } from "@/data/restaurants" // Import allRestaurants

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const filteredRestaurants = allRestaurants // Use allRestaurants from data file
    .filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((restaurant) => selectedCuisine === "all" || restaurant.cuisine.toLowerCase().includes(selectedCuisine))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "deliveryTime") return Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                QuickFood
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Mandya, Karnataka</span>
              </div>
              <Link href="/cart">
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                  Cart (0)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Restaurants in Mandya</h1>
          <p className="text-gray-600 mb-6">Curated by Admin Zeba Athiya • Fresh, Fast & Delicious</p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search restaurant or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="w-full md:w-48 border-red-200 focus:border-red-500">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="hyderabadi">Hyderabadi</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="south indian">South Indian</SelectItem>
                <SelectItem value="north indian">North Indian</SelectItem>
                <SelectItem value="street food">Street Food</SelectItem>
                <SelectItem value="seafood">Seafood</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-red-200 focus:border-red-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">Showing {filteredRestaurants.length} restaurants • Admin Approved ✓</p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 border-2 hover:border-red-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder.svg?height=200&width=300&query=Indian restaurant"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.featured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90">
                    {restaurant.priceRange}
                  </Badge>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
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

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No restaurants found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCuisine("all")
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
