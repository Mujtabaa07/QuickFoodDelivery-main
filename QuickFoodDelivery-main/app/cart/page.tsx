"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingCart, MapPin, ChefHat, Heart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context" // Added import

export default function CartPage() {
  const { cart, updateCartQuantity, getTotalItems, getTotalPrice } = useCart() // Using useCart hook
  const [promoCode, setPromoCode] = useState("")

  const cartItemsArray = Object.values(cart) // Convert cart object to array for mapping

  const subtotal = getTotalPrice()
  const deliveryFee = 25
  const tax = subtotal * 0.05 // 5% GST
  const total = subtotal + deliveryFee + tax

  if (getTotalItems() === 0) {
    // Check total items from context
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
              <Link href="/restaurants">
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Browse Restaurants
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-16 w-16 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any delicious items to your cart yet.
            </p>
            <Link href="/restaurants">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-3 text-lg">
                Start Ordering
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">Managed by Admins</p>
          </div>
        </div>
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
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Mandya, Karnataka</span>
              </div>
              <Link href="/restaurants">
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
          <Heart className="h-8 w-8 text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItemsArray.map(
              (
                item, // Use cartItemsArray from context
              ) => (
                <Card key={item.id} className="border-2 border-red-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.image || "/placeholder.svg?height=100&width=100&query=Indian food"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-red-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-red-600 text-sm font-medium mb-2">{item.restaurantName}</p>
                        <p className="font-bold text-2xl text-red-600">₹{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-red-50 rounded-lg p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)} // Use updateCartQuantity
                            className="border-red-300 text-red-600 hover:bg-red-100"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)} // Use updateCartQuantity
                            className="border-red-300 text-red-600 hover:bg-red-100"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCartQuantity(item.id, 0)} // Use updateCartQuantity to remove
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2 border-red-200 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-red-600">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Tax (GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between font-bold text-2xl mb-6 text-red-600">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                      Apply
                    </Button>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 text-lg font-semibold mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center space-y-2">
                  <p className="text-sm text-green-600 font-medium">✅ Free delivery on orders over ₹199</p>
                  <p className="text-xs text-gray-500">Managed by Admin Zeba Athiya</p>
                  <p className="text-xs text-gray-500">🔒 Safe &amp; Secure Payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
