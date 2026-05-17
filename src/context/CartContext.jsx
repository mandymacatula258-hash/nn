import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    )
  }

  const clearCart = () => setCartItems([])

  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty, 0
  )

  const totalItems = cartItems.reduce(
    (sum, i) => sum + i.qty, 0
  )

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}