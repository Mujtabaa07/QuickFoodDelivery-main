"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Star, Truck, Plus, Minus, ShoppingCart, ChefHat, Heart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useParams } from "next/navigation" // Import useParams
import { allRestaurants } from "@/data/restaurants" // Import allRestaurants

export default function RestaurantPage() {
  const { cart, addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart()
  const [activeTab, setActiveTab] = useState("menu")
  const params = useParams()
  const restaurantId = Number.parseInt(params.id as string) // Get ID from URL params

  const restaurant = allRestaurants.find((r) => r.id === restaurantId) // Find the restaurant

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-6">The restaurant you are looking for does not exist or has been removed.</p>
          <Link href="/restaurants">
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              Back to Restaurants
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

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
              <div className="flex items-center space-x-2 text-gray-600 mr-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Mandya, Karnataka</span>
              </div>
              <Link href="/restaurants">
                <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                  ← Back to Restaurants
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="relative border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({getTotalItems()})
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600">{getTotalItems()}</Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border-2 border-red-100">
          <div className="relative">
            <img
              src={restaurant.image || "/placeholder.svg?height=300&width=800&query=Indian restaurant interior"}
              alt={restaurant.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-lg opacity-90">{restaurant.description}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4 md:mb-0">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">
                    {restaurant.rating} ({restaurant.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="font-medium">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{restaurant.deliveryFee} delivery</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-600">Admin Zeba Athiya Approved ✓</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 mt-4">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-red-50 border border-red-200">
                <TabsTrigger value="menu" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Menu
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="menu" className="space-y-8 mt-6">
                {restaurant.menuCategories.map(
                  (
                    category, // Use restaurant's specific menu categories
                  ) => (
                    <div key={category.name}>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-red-200 pb-2">
                        {category.name}
                      </h2>
                      <div className="grid gap-6">
                        {category.items.map((item) => (
                          <Card
                            key={item.id}
                            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center space-x-6">
                                <img
                                  src={item.image || "/placeholder.svg?height=100&width=100&query=Indian food"}
                                  alt={item.name}
                                  className="w-24 h-24 object-cover rounded-xl border-2 border-red-100"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                                    <div
                                      className={`w-5 h-5 border-2 rounded ${item.veg ? "border-green-600" : "border-red-600"}`}
                                    >
                                      <div
                                        className={`w-3 h-3 rounded-full m-0.5 ${item.veg ? "bg-green-600" : "bg-red-600"}`}
                                      ></div>
                                    </div>
                                    {item.popular && (
                                      <Badge className="bg-gradient-to-r from-red-500 to-red-600">🔥 Popular</Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mb-3 leading-relaxed">{item.description}</p>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{item.rating}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600">₹{item.price}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {cart[item.id] && cart[item.id].quantity > 0 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFromCart(item.id)}
                                      className="border-red-500 text-red-600 hover:bg-red-50"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {cart[item.id] && cart[item.id].quantity > 0 && (
                                    <span className="w-8 text-center font-bold text-lg">{cart[item.id].quantity}</span>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.image,
                                        restaurant: restaurant.name,
                                      })
                                    }
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
                  {[1, 2, 3, 4, 5].map((review) => (
                    <Card key={review} className="border-2 border-red-100">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review === 1 ? "R" : review === 2 ? "S" : review === 3 ? "A" : review === 4 ? "P" : "M"}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">
                                {review === 1
                                  ? "Rajesh Kumar"
                                  : review === 2
                                    ? "Sunita Devi"
                                    : review === 3
                                      ? "Arjun Patel"
                                      : review === 4
                                        ? "Priya Sharma"
                                        : "Mohan Reddy"}
                              </span>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">
                              {review === 1
                                ? "2 days ago"
                                : review === 2
                                  ? "1 week ago"
                                  : review === 3
                                    ? "2 weeks ago"
                                    : review === 4
                                      ? "3 weeks ago"
                                      : "1 month ago"}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review === 1
                            ? "बहुत ही स्वादिष्ट biryani! Hyderabadi style perfect था। Admin Zeba Athiya ने सच में अच्छा restaurant choose किया है।"
                            : review === 2
                              ? "Amazing food quality and fast delivery. The Mysore Masala Dosa was authentic and delicious!"
                              : review === 3
                                ? "Best biryani in Mandya! Fresh ingredients और proper spices. Will definitely order again."
                                : review === 4
                                  ? "Excellent service और food quality. QuickFood team बहुत professional है।"
                                  : "Outstanding experience! The Karnataka specialties are must-try. Highly recommended!"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-6">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Restaurant Information</h2>
                  <Card className="border-2 border-red-100">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Address</h3>
                        <p className="text-gray-700">{restaurant.address}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Phone</h3>
                        <p className="text-gray-700">{restaurant.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Hours</h3>
                        <p className="text-gray-700">Mon-Sun: 11:00 AM - 11:00 PM</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Cuisine</h3>
                        <p className="text-gray-700">{restaurant.cuisine}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Admin Approval</h3>
                        <p className="text-gray-700">
                          ✅ Verified by Admin Zeba Athiya for quality and hygiene standards
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Cart Summary */}
          {getTotalItems() > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2 border-red-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4 text-red-600">Your Order</h3>
                  <div className="space-y-3 mb-6">
                    {Object.values(cart).map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            ₹{item.price} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-red-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Delivery Fee</span>
                      <span>{restaurant.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t border-red-200 pt-2">
                      <span>Total</span>
                      <span className="text-red-600">₹{(getTotalPrice() + 25).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 text-lg font-semibold">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center mt-3">Managed by Admin Zeba Athiya • Safe & Secure</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
