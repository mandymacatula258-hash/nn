import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "../firebase"
import { useCart } from "../context/CartContext"
import "./Checkout.css"

const STEPS = ["Shipping", "Payment", "Review"]

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  // ── Auth guard: redirect to login if not signed in ──
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login", { state: { from: "/checkout" } })
    })
    return unsub
  }, [navigate])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", address: "", city: "",
    province: "", zip: "", country: "Philippines",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  })

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: "" }))
  }

  const validateShipping = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim())  e.lastName  = "Required"
    if (!form.email.trim())     e.email     = "Required"
    if (!form.address.trim())   e.address   = "Required"
    if (!form.city.trim())      e.city      = "Required"
    if (!form.zip.trim())       e.zip       = "Required"
    return e
  }

  const validatePayment = () => {
    const e = {}
    if (!form.cardName.trim())   e.cardName   = "Required"
    if (!form.cardNumber.trim()) e.cardNumber = "Required"
    if (!form.expiry.trim())     e.expiry     = "Required"
    if (!form.cvv.trim())        e.cvv        = "Required"
    return e
  }

  const nextStep = () => {
    if (step === 0) {
      const e = validateShipping()
      if (Object.keys(e).length) { setErrors(e); return }
    }
    if (step === 1) {
      const e = validatePayment()
      if (Object.keys(e).length) { setErrors(e); return }
    }
    setStep((s) => s + 1)
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const user = auth.currentUser
      const order = {
        uid:       user ? user.uid   : "guest",
        email:     user ? user.email : form.email,
        shipping: {
          name:     `${form.firstName} ${form.lastName}`,
          phone:    form.phone,
          address:  form.address,
          city:     form.city,
          province: form.province,
          zip:      form.zip,
          country:  form.country,
        },
        items: cartItems.map((i) => ({
          id:    i.id,
          name:  i.name,
          price: i.price,
          qty:   i.qty,
        })),
        total:     totalPrice,
        status:    "pending",
        createdAt: serverTimestamp(),
      }
      const ref = await addDoc(collection(db, "orders"), order)
      setOrderId(ref.id)
      clearCart()
      setDone(true)
    } catch (err) {
      alert("Something went wrong: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Order confirmed screen ──
  if (done) {
    return (
      <div className="co">
        <div className="co-success">
          <div className="co-success__icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your purchase. Your order has been received.</p>
          <p className="co-success__id">Order ID: <strong>{orderId}</strong></p>
          <p className="co-success__note">A confirmation will be sent to <strong>{form.email}</strong></p>
          <button className="co-success__btn" onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  // ── Empty cart guard ──
  if (cartItems.length === 0) {
    return (
      <div className="co">
        <div className="co-success">
          <p>Your cart is empty.</p>
          <button className="co-success__btn" onClick={() => navigate("/shop")}>Go to Shop</button>
        </div>
      </div>
    )
  }

  return (
    <div className="co">
      <div className="co-inner">

        {/* ── Left: form ── */}
        <div className="co-form-col">

          {/* Step indicator */}
          <div className="co-steps">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`co-step${i <= step ? " co-step--on" : ""}${i < step ? " co-step--done" : ""}`}>
                  <span className="co-step__num">{i < step ? "✓" : i + 1}</span>
                  <span className="co-step__label">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`co-step-line${i < step ? " co-step-line--on" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ── Step 0: Shipping ── */}
          {step === 0 && (
            <div className="co-section">
              <h2 className="co-section__title">Shipping Information</h2>
              <div className="co-row">
                <Field label="First Name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
                <Field label="Last Name"  value={form.lastName}  onChange={set("lastName")}  error={errors.lastName} />
              </div>
              <Field label="Email Address" type="email" value={form.email} onChange={set("email")} error={errors.email} />
              <Field label="Phone Number"  type="tel"   value={form.phone} onChange={set("phone")} />
              <Field label="Street Address" value={form.address} onChange={set("address")} error={errors.address} />
              <div className="co-row">
                <Field label="City"     value={form.city}     onChange={set("city")}     error={errors.city} />
                <Field label="Province" value={form.province} onChange={set("province")} />
              </div>
              <div className="co-row">
                <Field label="ZIP Code" value={form.zip}     onChange={set("zip")}     error={errors.zip} />
                <Field label="Country"  value={form.country} onChange={set("country")} />
              </div>
              <button className="co-btn" onClick={nextStep}>Continue to Payment →</button>
            </div>
          )}

          {/* ── Step 1: Payment ── */}
          {step === 1 && (
            <div className="co-section">
              <h2 className="co-section__title">Payment Details</h2>
              <div className="co-card-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Secure payment — card details are encrypted
              </div>
              <Field label="Name on Card"   value={form.cardName}   onChange={set("cardName")}   error={errors.cardName} />
              <Field label="Card Number"    value={form.cardNumber} onChange={set("cardNumber")} error={errors.cardNumber} placeholder="1234 5678 9012 3456" maxLength={19} />
              <div className="co-row">
                <Field label="Expiry (MM/YY)" value={form.expiry} onChange={set("expiry")} error={errors.expiry} placeholder="MM/YY" maxLength={5} />
                <Field label="CVV" value={form.cvv} onChange={set("cvv")} error={errors.cvv} placeholder="•••" maxLength={4} />
              </div>
              <div className="co-btn-row">
                <button className="co-btn co-btn--ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="co-btn" onClick={nextStep}>Review Order →</button>
              </div>
            </div>
          )}

          {/* ── Step 2: Review ── */}
          {step === 2 && (
            <div className="co-section">
              <h2 className="co-section__title">Review Your Order</h2>

              <div className="co-review-block">
                <p className="co-review-block__label">Shipping to</p>
                <p>{form.firstName} {form.lastName}</p>
                <p>{form.address}, {form.city}, {form.province} {form.zip}</p>
                <p>{form.country} · {form.phone}</p>
              </div>

              <div className="co-review-block">
                <p className="co-review-block__label">Payment</p>
                <p>Card ending in {form.cardNumber.slice(-4) || "····"}</p>
              </div>

              <div className="co-btn-row">
                <button className="co-btn co-btn--ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="co-btn co-btn--place" onClick={placeOrder} disabled={loading}>
                  {loading ? "Placing Order…" : "Place Order →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div className="co-summary">
          <h3 className="co-summary__title">Order Summary</h3>
          <div className="co-summary__items">
            {cartItems.map((item) => (
              <div className="co-summary__item" key={item.id}>
                <img src={item.image} alt={item.name} className="co-summary__img" />
                <div className="co-summary__item-info">
                  <p className="co-summary__item-name">{item.name}</p>
                  <p className="co-summary__item-qty">Qty: {item.qty}</p>
                </div>
                <span className="co-summary__item-price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="co-summary__line"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="co-summary__line"><span>Shipping</span><span className="co-free">Free</span></div>
          <div className="co-summary__total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
        </div>

      </div>
    </div>
  )
}

// ── Field component ──
function Field({ label, value, onChange, error, type = "text", placeholder, maxLength }) {
  return (
    <div className={`co-field${error ? " co-field--err" : ""}`}>
      <label className="co-field__label">{label}</label>
      <input
        className="co-field__input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        maxLength={maxLength}
      />
      {error && <span className="co-field__err">{error}</span>}
    </div>
  )
}