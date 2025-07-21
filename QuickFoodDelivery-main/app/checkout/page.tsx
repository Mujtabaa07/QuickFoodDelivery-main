"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MapPin, CreditCard, Clock, CheckCircle, ChefHat, Shield } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context" // Added import

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart() // Using useCart hook
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "Mandya",
    state: "Karnataka",
    zipCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")

  const orderItems = Object.values(cart) // Get actual cart items from context

  const subtotal = getTotalPrice()
  const deliveryFee = 25
  const tax = subtotal * 0.05 // 5% GST
  const total = subtotal + deliveryFee + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (orderItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.")
      return
    }

    if (!deliveryAddress.street || !deliveryAddress.zipCode) {
      alert("Please fill in complete delivery address")
      return
    }

    if (
      paymentMethod === "card" &&
      (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)
    ) {
      alert("Please fill in all card details")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newOrderId = "QF" + Math.random().toString(36).substr(2, 9).toUpperCase()
      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart() // Clear the cart after successful order

      console.log("Order placed successfully:", {
        orderId: newOrderId,
        items: orderItems,
        address: deliveryAddress,
        paymentMethod,
        total,
      })
    } catch (error) {
      alert("There was a problem placing your order. Please try again.")
      console.error("Order placement failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Successfully Placed! 🎉</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you! Your order has been confirmed. Fresh and hot food will arrive soon.
            </p>

            <Card className="mb-8 border-2 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Order ID:</span>
                    <span className="text-red-600 font-bold text-xl">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Estimated Delivery:</span>
                    <span className="text-green-600 font-bold">25-35 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="font-bold text-2xl text-red-600">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-lg">Delivery Address:</span>
                    <div className="text-right">
                      <p>{deliveryAddress.street}</p>
                      <p>
                        {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Payment Method:</span>
                    <span className="capitalize font-medium">{paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Link href="/track-order">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 text-lg font-semibold mb-4">
                  Track Your Order 📍
                </Button>
              </Link>
              <Link href="/restaurants">
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent py-3"
                >
                  Order More Food
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-50">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">📱 You will receive SMS updates about your order status</p>
              <p className="text-xs text-gray-500">Managed by Admin Zeba Athiya • QuickFood Mandya</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your order • Managed by Admin Zeba Athiya</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <Card className="border-2 border-red-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Delivery Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="street" className="text-gray-700 font-medium">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      placeholder="House/Flat No., Building Name, Street"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, street: e.target.value }))}
                      required
                      className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700 font-medium">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, city: e.target.value }))}
                        required
                        className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-700 font-medium">
                        State *
                      </Label>
                      <Input
                        id="state"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, state: e.target.value }))}
                        required
                        className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                      PIN Code *
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="571401"
                      value={deliveryAddress.zipCode}
                      onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                      required
                      className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Time */}
              <Card className="border-2 border-red-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Delivery Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup defaultValue="asap">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asap" id="asap" />
                      <Label htmlFor="asap" className="font-medium">
                        ASAP (25-35 minutes) - Recommended
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="font-medium">
                        Schedule for later
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-2 border-red-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="font-medium">
                        🔥 UPI (PhonePe, Google Pay, Paytm) - Most Popular
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="font-medium">
                        💳 Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="font-medium">
                        🏦 Net Banking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="font-medium">
                        💰 Digital Wallet
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="font-medium">
                        💵 Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-6 p-4 bg-red-50 rounded-lg">
                      <div>
                        <Label htmlFor="cardName" className="text-gray-700 font-medium">
                          Cardholder Name *
                        </Label>
                        <Input
                          id="cardName"
                          placeholder="Name on card"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                          required={paymentMethod === "card"}
                          className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-700 font-medium">
                          Card Number *
                        </Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                          required={paymentMethod === "card"}
                          className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry" className="text-gray-700 font-medium">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                            required={paymentMethod === "card"}
                            className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-gray-700 font-medium">
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                            required={paymentMethod === "card"}
                            className="mt-1 border-red-200 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <Card className="sticky top-4 border-2 border-red-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-xl text-red-600">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 text-lg font-semibold mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing Order..." : "Place Order 🚀"}
                  </Button>

                  <div className="text-center space-y-2 mt-4">
                    <p className="text-xs text-gray-600">
                      By placing your order, you agree to QuickFood's Terms of Service and Privacy Policy
                    </p>
                    <p className="text-xs text-gray-500">🔒 Secure payment powered by QuickFood</p>
                    <p className="text-xs text-gray-500">Managed by Admin Zeba Athiya</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
