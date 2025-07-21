"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ChefHat,
  Users,
  ShoppingCart,
  TrendingUp,
  MapPin,
  Star,
  DollarSign,
  Phone,
  Mail,
  Settings,
  BarChart3,
  Eye,
} from "lucide-react"
import Link from "next/link"

const dashboardStats = [
  { title: "Total Orders Today", value: "147", change: "+12%", icon: ShoppingCart, color: "text-blue-600" },
  { title: "Active Restaurants", value: "23", change: "+2", icon: ChefHat, color: "text-green-600" },
  { title: "Total Customers", value: "2,847", change: "+156", icon: Users, color: "text-purple-600" },
  { title: "Revenue Today", value: "₹45,230", change: "+18%", icon: DollarSign, color: "text-red-600" },
]

const recentOrders = [
  {
    id: "QF123456",
    customer: "Rajesh Kumar",
    restaurant: "Mandya Biryani Palace",
    amount: "₹954",
    status: "Delivered",
    time: "2:45 PM",
  },
  {
    id: "QF123457",
    customer: "Sunita Devi",
    restaurant: "Karnataka Spice Kitchen",
    amount: "₹678",
    status: "Out for Delivery",
    time: "3:12 PM",
  },
  {
    id: "QF123458",
    customer: "Arjun Patel",
    restaurant: "Mysore Tiffin Center",
    amount: "₹345",
    status: "Preparing",
    time: "3:25 PM",
  },
  {
    id: "QF123459",
    customer: "Priya Sharma",
    restaurant: "Royal Mandya Dhaba",
    amount: "₹1,234",
    status: "Confirmed",
    time: "3:30 PM",
  },
]

const restaurants = [
  {
    id: 1,
    name: "Mandya Biryani Palace",
    rating: 4.8,
    orders: 89,
    revenue: "₹12,450",
    status: "Active",
  },
  {
    id: 2,
    name: "Karnataka Spice Kitchen",
    rating: 4.7,
    orders: 67,
    revenue: "₹9,870",
    status: "Active",
  },
  {
    id: 3,
    name: "Mysore Tiffin Center",
    rating: 4.6,
    orders: 45,
    revenue: "₹6,780",
    status: "Active",
  },
  {
    id: 4,
    name: "Royal Mandya Dhaba",
    rating: 4.5,
    orders: 34,
    revenue: "₹5,230",
    status: "Inactive",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
                QuickFood Admin
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ZA</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Zeba Athiya</p>
                  <p className="text-xs text-gray-600">Admin</p>
                </div>
              </div>
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, Zeba Athiya! Here's what's happening with QuickFood Mandya today.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-red-50 border border-red-200 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Orders
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {stat.change} from yesterday
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.restaurant}</p>
                          <p className="text-xs text-gray-500">{order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold text-red-600">{order.amount}</p>
                        <Badge
                          className={
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Out for Delivery"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>All Orders Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input placeholder="Search orders..." className="max-w-sm border-red-200 focus:border-red-500" />
                    <div className="flex space-x-2">
                      <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                        Filter
                      </Button>
                      <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                        Export
                      </Button>
                    </div>
                  </div>
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-red-100 rounded-lg"
                    >
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="font-semibold">#{order.id}</p>
                          <p className="text-sm text-gray-600">{order.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.restaurant}</p>
                        </div>
                        <div>
                          <p className="font-bold text-red-600">{order.amount}</p>
                        </div>
                        <div>
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Out for Delivery"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Preparing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-6">
            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>Restaurant Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Search restaurants..."
                      className="max-w-sm border-red-200 focus:border-red-500"
                    />
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                      Add Restaurant
                    </Button>
                  </div>
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center justify-between p-4 border border-red-100 rounded-lg"
                    >
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="font-semibold">{restaurant.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Orders Today</p>
                          <p className="font-bold">{restaurant.orders}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-bold text-green-600">{restaurant.revenue}</p>
                        </div>
                        <div>
                          <Badge
                            className={
                              restaurant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {restaurant.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            restaurant.status === "Active"
                              ? "border-red-500 text-red-600 hover:bg-red-50"
                              : "border-green-500 text-green-600 hover:bg-green-50"
                          }
                        >
                          {restaurant.status === "Active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-red-100 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Revenue Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Today's Revenue</span>
                      <span className="font-bold text-2xl text-green-600">₹45,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>This Week</span>
                      <span className="font-bold text-xl text-blue-600">₹2,87,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="font-bold text-xl text-purple-600">₹12,45,670</span>
                    </div>
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        📈 Revenue is up 23% compared to last month! Great job managing QuickFood Mandya.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-100 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Delivery Time</span>
                      <span className="font-bold text-green-600">28 mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Customer Satisfaction</span>
                      <span className="font-bold text-yellow-600">4.7/5 ⭐</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Order Success Rate</span>
                      <span className="font-bold text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <span className="font-bold text-blue-600">2,847</span>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        🎯 All metrics are performing excellently under your management, Zeba Athiya!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle>Admin Contact & Support</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Admin Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">ZA</span>
                        </div>
                        <div>
                          <p className="font-semibold">Zeba Athiya</p>
                          <p className="text-sm text-gray-600">QuickFood Admin</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>zeba.athiya@quickfood.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>Mandya, Karnataka</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        Add New Restaurant
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                        Send Notification
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                        Generate Report
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        Emergency Support
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
