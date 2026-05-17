import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"
import "./Shop.css"

import product1 from '../assets/1.png'
import product2 from '../assets/2.png'
import product3 from '../assets/3.png'
import product4 from '../assets/4.png'
import product5 from '../assets/5.png'
import product6 from '../assets/6.png'

// Match product name keywords to local asset images
const getLocalImage = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18×22") || n.includes("18x22")) return product1
  if (n.includes("f3") || n.includes("26×32") || n.includes("26x32")) return product2
  if (n.includes("flex") || n.includes("24×28") || n.includes("24x28")) return product3
  if (n.includes("dcr"))    return product4
  if (n.includes("tauron")) return product5
  if (n.includes("ctr"))    return product6
  return product1 // default fallback
}

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { cartItems, addToCart, removeFromCart, updateQty, totalPrice, totalItems } = useCart()
  const navigate = useNavigate()

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"))
        const data = snap.docs.map((d) => {
          const docData = d.data()
          return {
            id: d.id,
            ...docData,
            // Use Firestore image URL if valid, otherwise fall back to local asset
            image: docData.image && docData.image.startsWith("http")
              ? docData.image
              : getLocalImage(docData.name),
          }
        })
        setProducts(data)
      } catch (e) {
        console.error("Failed to load products:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="shop">
      <button className="shop__cart-fab" onClick={() => setCartOpen(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {totalItems > 0 && <span className="shop__cart-badge">{totalItems}</span>}
      </button>

      <section className="products" id="products">
        <div className="products__header">
          <p className="products__tagline">New Product Push</p>
          <h2 className="products__title">Innovation Never Stops</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#ccc" }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#ccc" }}>
            No products found.
          </div>
        ) : (
          <div className="products__grid">
            {products.map((product) => (
              <div className="products__card" key={product.id}>
                <div className="products__card-top">
                  <span className="products__card-category">{product.category}</span>
                  <div className="products__card-img-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="products__card-img"
                      draggable={false}
                      onError={(e) => {
                        // If image URL fails to load, fall back to local asset
                        e.target.onerror = null
                        e.target.src = getLocalImage(product.name)
                      }}
                    />
                  </div>
                </div>
                <div className="products__card-bottom">
                  <p className="products__card-name">{product.name}</p>
                  <p className="products__card-price">${Number(product.price).toFixed(2)}</p>
                  <div className="products__card-actions">
                    <Link to={product.link || "#"} className="products__card-link">
                      Learn More
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    <button
                      className="products__card-add"
                      onClick={() => { addToCart(product); setCartOpen(true) }}
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)} />}

      <div className={`cart-drawer${cartOpen ? " cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h3>Your Cart {totalItems > 0 && <span>({totalItems})</span>}</h3>
          <button className="cart-drawer__close" onClick={() => setCartOpen(false)}>x</button>
        </div>

        <div className="cart-drawer__items">
          {cartItems.length === 0 ? (
            <p className="cart-drawer__empty">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-drawer__item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-drawer__item-img" />
                <div className="cart-drawer__item-info">
                  <p className="cart-drawer__item-name">{item.name}</p>
                  <p className="cart-drawer__item-price">${(item.price * item.qty).toFixed(2)}</p>
                  <div className="cart-drawer__item-qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-drawer__item-remove" onClick={() => removeFromCart(item.id)}>x</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="cart-drawer__checkout"
              onClick={() => { setCartOpen(false); navigate("/checkout") }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}