"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
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
  RefreshCw,
  Filter,
  Search,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { adminAPI } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

interface DashboardStats {
  todayOrders: { value: number; change: string }
  activeRestaurants: { value: number; change: string }
  totalCustomers: { value: number; change: string }
  todayRevenue: { value: number; change: string }
}

interface RecentOrder {
  id: string
  customer: string
  restaurant: string
  amount: number
  status: string
  time: string
  date: string
}

interface Restaurant {
  id: string
  name: string
  rating: number
  status: string
  joinedDate: string
}

interface Order {
  id: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
  }
  restaurant: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: string
  paymentStatus: string
  deliveryAddress: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin, logout, isLoading: authLoading } = useAuth()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1)
  const [restaurantsPage, setRestaurantsPage] = useState(1)
  const [usersPage, setUsersPage] = useState(1)
  
  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [restaurantStatusFilter, setRestaurantStatusFilter] = useState("all")
  const [userRoleFilter, setUserRoleFilter] = useState("all")

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return
    
    // Check if user is admin, if not redirect to login
    if (!isAdmin) {
      router.push('/login')
      return
    }
    
    // Load dashboard data if user is admin
    loadDashboardData()
  }, [isAdmin, authLoading, router])

  useEffect(() => {
    if (activeTab === "orders" && isAdmin) {
      loadOrders()
    } else if (activeTab === "restaurants" && isAdmin) {
      loadRestaurants()
    } else if (activeTab === "users" && isAdmin) {
      loadUsers()
    }
  }, [activeTab, ordersPage, restaurantsPage, usersPage, orderStatusFilter, restaurantStatusFilter, userRoleFilter, isAdmin])

  const loadDashboardData = async () => {
    try {
      setDataLoading(true)
      
      const response = await adminAPI.getDashboardStats()
      
      // Backend returns data directly, not wrapped in a success object
      if (response && response.stats) {
        setDashboardStats(response.stats)
        setRecentOrders(response.recentOrders || [])
        setRestaurants(response.restaurants || [])
        toast({
          title: "Success",
          description: "Dashboard data loaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Invalid response format from server",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast({
        title: "Error",
        description: "Failed to connect to server. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setDataLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await adminAPI.getOrders(ordersPage, 10, orderStatusFilter)
      // Backend returns orders directly
      if (response && response.orders) {
        setOrders(response.orders)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadRestaurants = async () => {
    try {
      const response = await adminAPI.getRestaurants(restaurantsPage, 10, restaurantStatusFilter)
      // Backend returns restaurants directly  
      if (response && response.restaurants) {
        setRestaurants(response.restaurants)
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers(usersPage, 10, userRoleFilter)
      // Backend returns users directly
      if (response && response.users) {
        setUsers(response.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
        loadOrders()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const updateRestaurantStatus = async (restaurantId: string, newStatus: string) => {
    try {
      const response = await adminAPI.updateRestaurantStatus(restaurantId, newStatus)
      if (response.success) {
        toast({
          title: "Success",
          description: "Restaurant status updated successfully",
        })
        loadRestaurants()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update restaurant status",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Active':
        return 'bg-blue-100 text-blue-800'
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
      case 'Inactive':
      case 'Suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading if checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-8 rounded-lg">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>
            <p className="text-red-600 mb-4">You don't have permission to access the admin dashboard.</p>
            <Link href="/">
              <Button variant="outline">Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QuickFood Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.firstName}! Manage your food delivery platform</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={loadDashboardData}
                disabled={dataLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-red-50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Orders
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Loading State */}
            {dataLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-red-500" />
                  <p className="text-gray-600">Loading dashboard data...</p>
                </div>
              </div>
            )}
            
            {/* No Data State */}
            {!dataLoading && !dashboardStats && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No dashboard data available</p>
                  <Button onClick={loadDashboardData} className="bg-red-500 hover:bg-red-600">
                    Load Data
                  </Button>
                </div>
              </div>
            )}
            
            {/* Stats Cards */}
            {!dataLoading && dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders Today</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardStats.todayOrders.value}</p>
                        <p className={`text-sm ${dashboardStats.todayOrders.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {dashboardStats.todayOrders.change} from yesterday
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100 text-blue-600">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Restaurants</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeRestaurants.value}</p>
                        <p className="text-sm text-gray-600">{dashboardStats.activeRestaurants.change}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100 text-green-600">
                        <ChefHat className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalCustomers.value}</p>
                        <p className="text-sm text-green-600">{dashboardStats.totalCustomers.change}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100 text-purple-600">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats.todayRevenue.value)}</p>
                        <p className={`text-sm ${dashboardStats.todayRevenue.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {dashboardStats.todayRevenue.change} from yesterday
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-100 text-red-600">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
                          <p className="text-sm text-gray-500">{order.time} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Overview */}
            <Card className="border-2 border-red-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle>Restaurant Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurants.slice(0, 6).map((restaurant) => (
                    <div key={restaurant.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        <Badge className={getStatusColor(restaurant.status)}>
                          {restaurant.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
                        <span>•</span>
                        <span>Joined: {restaurant.joinedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <div className="flex space-x-4">
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-gray-500">{order.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select 
                            value={order.status} 
                            onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Preparing">Preparing</SelectItem>
                              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Management</h2>
              <div className="flex space-x-4">
                <Select value={restaurantStatusFilter} onValueChange={setRestaurantStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Restaurants</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="border-2 border-gray-200 hover:border-red-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(restaurant.status)}>
                        {restaurant.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Joined: {restaurant.joinedDate}</p>
                    <Select 
                      value={restaurant.status} 
                      onValueChange={(newStatus) => updateRestaurantStatus(restaurant.id, newStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-4">
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-red-500" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Success Rate</span>
                      <span className="font-semibold">95.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Delivery Time</span>
                      <span className="font-semibold">28 mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-semibold">4.7/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Week</span>
                      <span className="font-semibold text-green-600">+15.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold text-green-600">+22.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Year</span>
                      <span className="font-semibold text-green-600">+45.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Active Users</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Signups Today</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retention Rate</span>
                      <span className="font-semibold">78.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
