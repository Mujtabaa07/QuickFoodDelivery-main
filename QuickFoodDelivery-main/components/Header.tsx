'use client';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Star, Truck, ChefHat, Heart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="bg-white shadow-lg border-b-4 border-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                QuickFood
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Mandya, Karnataka</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/track-order">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    Track Order
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                      <User className="h-4 w-4 mr-2" />
                      {user?.firstName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
