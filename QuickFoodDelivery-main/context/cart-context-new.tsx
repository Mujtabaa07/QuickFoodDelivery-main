"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import { orderAPI } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  restaurantName: string
  restaurantId: string
}

interface CartContextType {
  cart: { [itemId: string]: CartItem }
  addToCart: (item: { id: string; name: string; price: number; image: string; restaurant: string; restaurantId: string }) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, newQuantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  checkout: (deliveryAddress: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ [itemId: string]: CartItem }>({})
  const { user, isAuthenticated } = useAuth()

  const addToCart = useCallback(
    (item: { id: string; name: string; price: number; image: string; restaurant: string; restaurantId: string }) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart")
        return
      }
      
      setCart((prev) => {
        const existingItem = prev[item.id]
        if (existingItem) {
          return {
            ...prev,
            [item.id]: {
              ...existingItem,
              quantity: existingItem.quantity + 1,
            },
          }
        } else {
          return {
            ...prev,
            [item.id]: {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: 1,
              image: item.image,
              restaurantName: item.restaurant,
              restaurantId: item.restaurantId,
            },
          }
        }
      })
      toast.success(`${item.name} added to cart!`)
    },
    [isAuthenticated]
  )

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const { [itemId]: removed, ...rest } = prev
      return rest
    })
    toast.success("Item removed from cart")
  }, [])

  const updateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: newQuantity,
      },
    }))
  }, [removeFromCart])

  const getTotalItems = useCallback(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const getTotalPrice = useCallback(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const clearCart = useCallback(() => {
    setCart({})
  }, [])

  const checkout = useCallback(async (deliveryAddress: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to place an order")
      return
    }

    const cartItems = Object.values(cart)
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    // Check if all items are from the same restaurant
    const restaurantIds = [...new Set(cartItems.map(item => item.restaurantId))]
    if (restaurantIds.length > 1) {
      toast.error("All items must be from the same restaurant")
      return
    }

    try {
      const orderData = {
        restaurantId: restaurantIds[0],
        items: cartItems.map(item => ({
          foodId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress,
        totalAmount: getTotalPrice()
      }

      const response = await orderAPI.create(orderData)
      toast.success("Order placed successfully!")
      clearCart()
      return response
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast.error(error.message || "Failed to place order")
      throw error
    }
  }, [cart, isAuthenticated, user, getTotalPrice, clearCart])

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    checkout,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
