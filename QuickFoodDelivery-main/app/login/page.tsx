"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChefHat, Eye, EyeOff, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [loginType, setLoginType] = useState("email")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
    // Redirect to home page after successful login
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <ChefHat className="h-7 w-7 text-white" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              QuickFood
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Login to your account and order your favorite food</p>
        </div>

        <Card className="shadow-2xl border-2 border-red-100">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">Sign In to QuickFood</CardTitle>
            <CardDescription className="text-center text-red-100">Managed by Admin Zeba Athiya</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Type Selection */}
              <div className="flex space-x-4 mb-6">
                <Button
                  type="button"
                  variant={loginType === "email" ? "default" : "outline"}
                  className={`flex-1 ${loginType === "email" ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-600 hover:bg-red-50"}`}
                  onClick={() => setLoginType("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={loginType === "phone" ? "default" : "outline"}
                  className={`flex-1 ${loginType === "phone" ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-600 hover:bg-red-50"}`}
                  onClick={() => setLoginType("phone")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Button>
              </div>

              {/* Email/Phone Input */}
              {loginType === "email" ? (
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter your email address"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              )}

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-red-600 hover:text-red-500">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button variant="outline" className="border-red-200 hover:bg-red-50 bg-transparent">
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button variant="outline" className="border-red-200 hover:bg-red-50 bg-transparent">
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
                <Button variant="outline" className="border-red-200 hover:bg-red-50 bg-transparent">
                  <span className="text-sm font-medium">OTP</span>
                </Button>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to QuickFood?{" "}
                <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">🔒 Secure login powered by QuickFood Security</p>
          <p className="text-xs text-gray-400 mt-1">For support, contact Admin Zeba Athiya</p>
        </div>
      </div>
    </div>
  )
}
