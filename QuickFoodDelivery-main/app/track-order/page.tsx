"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CheckCircle, Truck, ChefHat, Package, User, Phone } from "lucide-react"
import Link from "next/link"

const orderStatuses = [
  { id: 1, status: "Order Confirmed", icon: CheckCircle, completed: true, time: "2:30 PM" },
  { id: 2, status: "Restaurant Preparing", icon: ChefHat, completed: true, time: "2:35 PM" },
  { id: 3, status: "Food Ready", icon: Package, completed: true, time: "2:50 PM" },
  { id: 4, status: "Out for Delivery", icon: Truck, completed: false, time: "3:00 PM (Est.)" },
]

const deliveryPerson = {
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  rating: 4.8,
  deliveries: 1247,
  vehicle: "Bike - KA 20 AB 1234",
  photo: "/images/delivery-person-rajesh.png",
}

export default function TrackOrderPage() {
  const [currentStep, setCurrentStep] = useState(3)
  const [estimatedTime, setEstimatedTime] = useState(15)

  useEffect(() => {
    // Simulate order progress
    const interval = setInterval(() => {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1)
        setEstimatedTime((prev) => Math.max(0, prev - 5))
      }
    }, 10000) // Update every 10 seconds for demo

    return () => clearInterval(interval)
  }, [currentStep])

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
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Mandya, Karnataka</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Track Your Order</h1>
          <div className="animate-pulse">🚚</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status */}
          <div>
            <Card className="mb-6 border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {orderStatuses.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep - 1

                    return (
                      <div key={step.id} className="flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? "bg-green-500 text-white scale-110"
                              : isCurrent
                                ? "bg-red-500 text-white animate-pulse scale-110"
                                : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-lg ${
                              isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-500">{step.time}</p>
                        </div>
                        {isCurrent && <Badge className="bg-red-100 text-red-800 animate-bounce">Current</Badge>}
                        {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Estimated Delivery</h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">{estimatedTime} mins</p>
                  <p className="text-gray-600">Your delicious food will arrive soon!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details & Delivery Person */}
          <div className="space-y-6">
            {/* Delivery Person Info */}
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Your Delivery Partner</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={deliveryPerson.photo || "/placeholder.svg?height=80&width=80&query=delivery person"}
                    alt={deliveryPerson.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{deliveryPerson.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>⭐ {deliveryPerson.rating}</span>
                      <span>•</span>
                      <span>{deliveryPerson.deliveries} deliveries</span>
                    </div>
                    <p className="text-sm text-gray-600">{deliveryPerson.vehicle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Rajesh
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    💬 Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span className="text-red-600 font-bold">QF123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Restaurant:</span>
                    <span>Mandya Biryani Palace</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Items:</span>
                    <span>3 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-red-600">₹954.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment:</span>
                    <span className="text-green-600">✅ Paid via UPI</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Home</p>
                    <p className="text-gray-600">
                      123 Main Street, Hosalli Circle
                      <br />
                      Mandya, Karnataka 571401
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                📞 Call Restaurant
              </Button>
              <Link href="/restaurants">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Order Again
                </Button>
              </Link>
              <p className="text-center text-xs text-gray-500">Managed by Admins • QuickFood Mandya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
