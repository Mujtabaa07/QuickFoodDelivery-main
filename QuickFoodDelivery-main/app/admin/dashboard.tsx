'use client';

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Store, Package, TrendingUp, Loader2 } from "lucide-react"
import Header from "@/components/Header"
import { adminAPI } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.")
      router.push("/")
      return
    }
    fetchDashboardStats()
  }, [isAdmin, router])

  const fetchDashboardStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats()
      setStats(data.stats || data)
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Failed to load dashboard statistics")
      // Fallback to mock data
      setStats({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}! Here's what's happening with QuickFood.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  +12% from last month
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Restaurants</CardTitle>
                <Store className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalRestaurants || 0}</div>
                <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                  +3 new partners
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
                <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                  +8% from last week
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  +15% from last month
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-red-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left">
                  <h3 className="font-medium text-red-700">Manage Restaurants</h3>
                  <p className="text-sm text-red-600">Add or edit restaurant details</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-medium text-blue-700">View Orders</h3>
                  <p className="text-sm text-blue-600">Monitor all incoming orders</p>
                </button>
                <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                  <h3 className="font-medium text-green-700">User Management</h3>
                  <p className="text-sm text-green-600">Manage customer accounts</p>
                </button>
                <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                  <h3 className="font-medium text-purple-700">Analytics</h3>
                  <p className="text-sm text-purple-600">View detailed reports</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New restaurant "Spice Garden" added</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">45 new orders received today</span>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">System maintenance completed</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New user registrations: 12</span>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
