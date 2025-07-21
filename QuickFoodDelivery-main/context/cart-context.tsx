"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  restaurantName: string
}

interface CartContextType {
  cart: { [itemId: number]: CartItem }
  addToCart: (item: { id: number; name: string; price: number; image: string; restaurant: string }) => void
  removeFromCart: (itemId: number) => void
  updateCartQuantity: (itemId: number, newQuantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ [itemId: number]: CartItem }>({})

  const addToCart = useCallback(
    (item: { id: number; name: string; price: number; image: string; restaurant: string }) => {
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
            },
          }
        }
      })
    },
    [],
  )

  const removeFromCart = useCallback((itemId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId]) {
        if (newCart[itemId].quantity > 1) {
          newCart[itemId].quantity -= 1
        } else {
          delete newCart[itemId]
        }
      }
      return newCart
    })
  }, [])

  const updateCartQuantity = useCallback((itemId: number, newQuantity: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newQuantity <= 0) {
        delete newCart[itemId]
      } else {
        if (newCart[itemId]) {
          newCart[itemId].quantity = newQuantity
        }
      }
      return newCart
    })
  }, [])

  const getTotalItems = useCallback(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const getTotalPrice = useCallback(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const clearCart = useCallback(() => {
    setCart({})
  }, [])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartQuantity, getTotalItems, getTotalPrice, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
