import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { db, auth } from "../firebase"
import {
  collection, getDocs, addDoc, query, where, serverTimestamp, onSnapshot
} from "firebase/firestore"
import "./Shop.css"

import product1 from '../assets/1.png'
import product2 from '../assets/2.png'
import product3 from '../assets/3.png'
import product4 from '../assets/4.png'
import product5 from '../assets/5.png'
import product6 from '../assets/6.png'

const getLocalImage = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18×22") || n.includes("18x22")) return product1
  if (n.includes("f3") || n.includes("26×32") || n.includes("26x32")) return product2
  if (n.includes("flex") || n.includes("24×28") || n.includes("24x28")) return product3
  if (n.includes("dcr"))    return product4
  if (n.includes("tauron")) return product5
  if (n.includes("ctr"))    return product6
  return product1
}

// ── Reservation Modal ────────────────────────────────────────────────────────
function ReserveModal({ product, onClose, onSuccess }) {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ date: "", time: "", notes: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user) { navigate("/login"); return }
    if (!form.date || !form.time) { setError("Please select a date and time."); return }

    setLoading(true)
    setError("")
    try {
      await addDoc(collection(db, "reservations"), {
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName || "",
        productId:   product.id,
        productName: product.name,
        date:        form.date,
        time:        form.time,
        notes:       form.notes,
        status:      "pending",
        createdAt:   serverTimestamp(),
      })
      onSuccess(product.id)
      onClose()
    } catch (e) {
      setError("Failed to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="res-overlay" onClick={onClose}>
      <div className="res-modal" onClick={e => e.stopPropagation()}>
        <div className="res-modal__header">
          <h3>📅 Reserve for In-Store Testing</h3>
          <button className="res-modal__close" onClick={onClose}>✕</button>
        </div>

        <p className="res-modal__product">{product.name}</p>

        <p className="res-modal__info">
          Visit our store to try this product before you buy. Pick a date and time — our team will confirm your slot.
        </p>

        <div className="res-field">
          <label>Preferred Date *</label>
          <input
            type="date"
            value={form.date}
            min={minDateStr}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          />
        </div>

        <div className="res-field">
          <label>Preferred Time *</label>
          <input
            type="time"
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
          />
          <span className="res-field__hint">Store hours: 9:00 AM – 6:00 PM</span>
        </div>

        <div className="res-field">
          <label>Notes (optional)</label>
          <textarea
            rows={3}
            placeholder="Features you want to test, questions for our staff..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
        </div>

        {error && <p className="res-error">{error}</p>}

        <div className="res-modal__actions">
          <button className="res-cancel" onClick={onClose}>Cancel</button>
          <button className="res-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Reservation"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Shop Component ──────────────────────────────────────────────────────
export default function Shop() {
  const [cartOpen, setCartOpen]       = useState(false)
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [reserveProduct, setReserveProduct] = useState(null)  // product being reserved
  const [userReservations, setUserReservations] = useState({}) // { productId: status }
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
            image: docData.image && (docData.image.startsWith("http") || docData.image.startsWith("data:"))
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

  // Real-time listener for current user's reservations
  // Updates the card UI instantly when admin approves/rejects
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const q = query(
      collection(db, "reservations"),
      where("uid", "==", user.uid)
    )

    const unsub = onSnapshot(q, (snap) => {
      const map = {}
      snap.docs.forEach(d => {
        const data = d.data()
        map[data.productId] = data.status
      })
      setUserReservations(map)
    })

    return () => unsub()
  }, [])

  // Called after successful reservation submission
  const handleReserveSuccess = (productId) => {
    setUserReservations(prev => ({ ...prev, [productId]: "pending" }))
  }

  const getReserveBtnLabel = (productId) => {
    const status = userReservations[productId]
    if (status === "pending")  return "🕐 Pending Approval"
    if (status === "approved") return "✅ Reservation Approved"
    if (status === "rejected") return "❌ Not Approved"
    return "📅 Reserve to Try"
  }

  const getReserveBtnClass = (productId) => {
    const status = userReservations[productId]
    if (status === "pending")  return "products__card-reserve products__card-reserve--pending"
    if (status === "approved") return "products__card-reserve products__card-reserve--approved"
    if (status === "rejected") return "products__card-reserve products__card-reserve--rejected"
    return "products__card-reserve"
  }

  const handleReserveClick = (product) => {
    const status = userReservations[product.id]
    // Allow re-reserve only if rejected; otherwise just open modal for new reservations
    if (status === "pending" || status === "approved") return
    setReserveProduct(product)
  }

  return (
    <div className="shop">

      {/* Reservation Modal */}
      {reserveProduct && (
        <ReserveModal
          product={reserveProduct}
          onClose={() => setReserveProduct(null)}
          onSuccess={handleReserveSuccess}
        />
      )}

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
                    <button
                      className="products__card-add"
                      onClick={() => { addToCart(product); setCartOpen(true) }}
                    >
                      + Add to Cart
                    </button>
                  </div>

                  {/* ── Reserve Button ── */}
                  <button
                    className={getReserveBtnClass(product.id)}
                    onClick={() => handleReserveClick(product)}
                  >
                    {getReserveBtnLabel(product.id)}
                  </button>

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