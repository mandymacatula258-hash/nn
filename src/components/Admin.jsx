import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase"
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import "./Admin.css"

// ── YOUR admin email — only this account can access ──
const ADMIN_EMAIL = "mandymacatula258@gmail.com"

export default function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [resLoading, setResLoading] = useState(false)
  const [selectedRes, setSelectedRes] = useState(null) // reservation detail modal
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "", category: "", price: "", image: "", link: "", description: ""
  })
  const [addImageFile, setAddImageFile] = useState(null)
  const [addImagePreview, setAddImagePreview] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  // ── Auth check ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email === ADMIN_EMAIL) {
        setUser(u)
      } else {
        setUser(null)
      }
      setChecking(false)
    })
    return unsub
  }, [])

  // ── Load products ──
  useEffect(() => {
    if (user) fetchProducts()
  }, [user])

  useEffect(() => {
    if (user && activeTab === "orders") fetchOrders()
    if (user && activeTab === "reservations") fetchReservations()
  }, [user, activeTab])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, "products"))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      showToast("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const snap = await getDocs(collection(db, "orders"))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setOrders(data)
    } catch (e) {
      showToast("Failed to load orders")
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchReservations = async () => {
    setResLoading(true)
    try {
      const snap = await getDocs(collection(db, "reservations"))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setReservations(data)
    } catch (e) {
      showToast("Failed to load reservations")
    } finally {
      setResLoading(false)
    }
  }

  const updateReservation = async (resId, status) => {
    try {
      await updateDoc(doc(db, "reservations", resId), { status })
      setReservations(prev => prev.map(r => r.id === resId ? { ...r, status } : r))
      if (selectedRes?.id === resId) setSelectedRes(prev => ({ ...prev, status }))
      showToast(status === "approved" ? "✅ Reservation approved!" : "❌ Reservation rejected.")
    } catch (e) {
      showToast("Failed to update reservation")
    }
  }

  const confirmOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "confirmed" })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "confirmed" } : o))
      showToast("Order confirmed!")
    } catch (e) {
      showToast("Failed to confirm order")
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const uploadImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX = 200
        let w = img.width, h = img.height
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX }
        canvas.width = w
        canvas.height = h
        canvas.getContext("2d").drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL("image/jpeg", 0.5)
        if (base64.length > 900000) {
          reject(new Error("Image too large even after compression. Please use a smaller image or a URL instead."))
        } else {
          resolve(base64)
        }
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError("")
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      if (cred.user.email !== ADMIN_EMAIL) {
        await signOut(auth)
        setLoginError("Access denied. Admin only.")
      }
    } catch (err) {
      setLoginError("Invalid email or password.")
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  // ── Edit product ──
  const startEdit = (product) => {
    setEditingId(product.id)
    setEditForm({ ...product })
  }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const { id, ...data } = editForm
      await updateDoc(doc(db, "products", editingId), {
        ...data,
        price: parseFloat(editForm.price),
        updatedAt: serverTimestamp()
      })
      setProducts(prev => prev.map(p => p.id === editingId ? { ...editForm, price: parseFloat(editForm.price) } : p))
      setEditingId(null)
      showToast("Product updated!")
    } catch (e) {
      showToast("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  // ── Add product ──
  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = addForm.image
      if (addImageFile) {
        try {
          imageUrl = await uploadImage(addImageFile)
        } catch (err) {
          showToast(err.message || "Image too large. Use a URL instead.")
          setSaving(false)
          return
        }
      }
      const finalForm = { ...addForm, image: imageUrl }
      const docRef = await addDoc(collection(db, "products"), {
        ...finalForm,
        price: parseFloat(addForm.price),
        createdAt: serverTimestamp()
      })
      setProducts(prev => [...prev, { id: docRef.id, ...finalForm, price: parseFloat(addForm.price) }])
      setAddForm({ name: "", category: "", price: "", image: "", link: "", description: "" })
      setAddImageFile(null)
      setAddImagePreview("")
      setShowAdd(false)
      showToast("Product added!")
    } catch (e) {
      showToast("Failed to add product")
    } finally {
      setSaving(false)
    }
  }

  // ── Delete product ──
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await deleteDoc(doc(db, "products", id))
      setProducts(prev => prev.filter(p => p.id !== id))
      showToast("Product deleted.")
    } catch (e) {
      showToast("Failed to delete product")
    }
  }

  // ── Derived counts ──
  const pendingResCount = reservations.filter(r => r.status === "pending").length

  // ── Format time to 12hr ──
  const formatTime = (timeStr) => {
    if (!timeStr) return "—"
    const [h, m] = timeStr.split(":")
    const hour = parseInt(h)
    const ampm = hour >= 12 ? "PM" : "AM"
    const display = hour % 12 || 12
    return `${display}:${m} ${ampm}`
  }

  // ── Loading screen ──
  if (checking) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
      </div>
    )
  }

  // ── Login screen ──
  if (!user) {
    return (
      <div className="adm-login">
        <div className="adm-login__box">
          <div className="adm-login__logo">
            <span className="adm-login__lock">⬡</span>
            <h1>Admin Portal</h1>
            <p>Impaq Optics — Restricted Access</p>
          </div>
          <form onSubmit={handleLogin} className="adm-login__form">
            <div className="adm-field">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@email.com"
                required
              />
            </div>
            <div className="adm-field">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && <p className="adm-login__error">{loginError}</p>}
            <button type="submit" className="adm-btn adm-btn--gold">Sign In</button>
          </form>
        </div>
      </div>
    )
  }

  // ── Admin dashboard ──
  return (
    <div className="adm">
      {toast && <div className="adm-toast">{toast}</div>}

      {/* Reservation Detail Modal */}
      {selectedRes && (
        <div className="adm-modal-overlay" onClick={() => setSelectedRes(null)}>
          <div className="adm-modal adm-modal--res" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h3>Reservation Details</h3>
              <button className="adm-modal__close" onClick={() => setSelectedRes(null)}>✕</button>
            </div>
            <div className="adm-modal__form">
              <div className="adm-res-detail">
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Customer</span>
                  <span className="adm-res-detail__value">
                    {selectedRes.displayName && <strong>{selectedRes.displayName}</strong>}
                    <span style={{color:"#888",display:"block",fontSize:"0.82rem"}}>{selectedRes.email}</span>
                  </span>
                </div>
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Product</span>
                  <span className="adm-res-detail__value">{selectedRes.productName}</span>
                </div>
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Date</span>
                  <span className="adm-res-detail__value">{selectedRes.date}</span>
                </div>
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Time</span>
                  <span className="adm-res-detail__value">{formatTime(selectedRes.time)}</span>
                </div>
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Notes</span>
                  <span className="adm-res-detail__value" style={{color: selectedRes.notes ? "#e8e8e8" : "#444"}}>
                    {selectedRes.notes || "No notes provided."}
                  </span>
                </div>
                <div className="adm-res-detail__row">
                  <span className="adm-res-detail__label">Status</span>
                  <span>
                    <span className={`adm-badge${selectedRes.status === "approved" ? " adm-badge--green" : selectedRes.status === "rejected" ? " adm-badge--red" : ""}`}>
                      {selectedRes.status}
                    </span>
                  </span>
                </div>
              </div>

              {selectedRes.status === "pending" && (
                <div className="adm-modal__actions" style={{marginTop:"1.5rem"}}>
                  <button
                    className="adm-btn adm-btn--danger"
                    onClick={() => updateReservation(selectedRes.id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="adm-btn adm-btn--gold"
                    onClick={() => updateReservation(selectedRes.id, "approved")}
                  >
                    ✓ Approve Reservation
                  </button>
                </div>
              )}
              {selectedRes.status === "approved" && (
                <p style={{color:"#4caf50",fontSize:"0.85rem",marginTop:"1rem",textAlign:"center"}}>
                  ✅ This reservation has been approved. The customer has been notified.
                </p>
              )}
              {selectedRes.status === "rejected" && (
                <p style={{color:"#e53e3e",fontSize:"0.85rem",marginTop:"1rem",textAlign:"center"}}>
                  ❌ This reservation was rejected.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <span>⬡</span> Admin
        </div>
        <nav className="adm-sidebar__nav">
          <button
            className={`adm-sidebar__link${activeTab === "products" ? " active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            Products
          </button>
          <button
            className={`adm-sidebar__link${activeTab === "orders" ? " active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Orders
          </button>
          <button
            className={`adm-sidebar__link${activeTab === "reservations" ? " active" : ""}`}
            onClick={() => setActiveTab("reservations")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Reservations
            {/* Pending badge — shows count of reservations needing action */}
            {pendingResCount > 0 && (
              <span className="adm-sidebar__badge">{pendingResCount}</span>
            )}
          </button>
          <button className="adm-sidebar__link" onClick={() => navigate("/shop")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            View Shop
          </button>
        </nav>
        <button className="adm-sidebar__logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <div className="adm-main__header">
          <div>
            <h2>Products</h2>
            <p>{products.length} items in shop</p>
          </div>
          <button className="adm-btn adm-btn--gold" onClick={() => setShowAdd(true)}>
            + Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        {showAdd && (
          <div className="adm-modal-overlay" onClick={() => setShowAdd(false)}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>
              <div className="adm-modal__header">
                <h3>Add New Product</h3>
                <button className="adm-modal__close" onClick={() => setShowAdd(false)}>✕</button>
              </div>
              <form onSubmit={handleAdd} className="adm-modal__form">
                <div className="adm-row">
                  <div className="adm-field">
                    <label>Product Name *</label>
                    <input value={addForm.name} onChange={e => setAddForm(f => ({...f, name: e.target.value}))} required placeholder="e.g. Frenzy FA 18×22" />
                  </div>
                  <div className="adm-field">
                    <label>Category *</label>
                    <input value={addForm.category} onChange={e => setAddForm(f => ({...f, category: e.target.value}))} required placeholder="e.g. Red Dot Sight" />
                  </div>
                </div>
                <div className="adm-row">
                  <div className="adm-field">
                    <label>Price (USD) *</label>
                    <input type="number" step="0.01" value={addForm.price} onChange={e => setAddForm(f => ({...f, price: e.target.value}))} required placeholder="129.99" />
                  </div>
                  <div className="adm-field">
                    <label>Product Page Link</label>
                    <input value={addForm.link} onChange={e => setAddForm(f => ({...f, link: e.target.value}))} placeholder="/products/frenzy-fa" />
                  </div>
                </div>
                <div className="adm-field">
                  <label>Image</label>
                  <div className="adm-image-options">
                    <input
                      className="adm-image-url-input"
                      value={addForm.image}
                      onChange={e => { setAddForm(f => ({...f, image: e.target.value})); setAddImageFile(null); setAddImagePreview("") }}
                      placeholder="Paste image URL..."
                    />
                    <span className="adm-image-or">or</span>
                    <label className="adm-upload-btn" title="Upload image">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0]
                          if (file) {
                            setAddImageFile(file)
                            setAddImagePreview(URL.createObjectURL(file))
                            setAddForm(f => ({...f, image: ""}))
                          }
                        }}
                      />
                    </label>
                  </div>
                  {(addImagePreview || addForm.image) && (
                    <img
                      src={addImagePreview || addForm.image}
                      alt="Preview"
                      className="adm-image-preview"
                      onError={e => e.target.style.display = "none"}
                    />
                  )}
                </div>
                <div className="adm-field">
                  <label>Description</label>
                  <textarea value={addForm.description} onChange={e => setAddForm(f => ({...f, description: e.target.value}))} placeholder="Short product description..." rows={3} />
                </div>
                <div className="adm-modal__actions">
                  <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button type="submit" className="adm-btn adm-btn--gold" disabled={saving}>
                    {saving ? "Adding..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="adm-main__header" style={{marginBottom:"1.5rem"}}>
              <div><h2>Orders</h2><p>{orders.length} total orders</p></div>
            </div>
            {ordersLoading ? (
              <div className="adm-loading-inline"><div className="adm-spinner" /></div>
            ) : orders.length === 0 ? (
              <div className="adm-empty">No orders yet.</div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{fontSize:"0.75rem",color:"#555"}}>{order.id.slice(0,8)}…</td>
                        <td>
                          <p style={{margin:0,fontSize:"0.85rem"}}>{order.shipping?.name}</p>
                          <p style={{margin:0,fontSize:"0.75rem",color:"#666"}}>{order.email}</p>
                        </td>
                        <td style={{fontSize:"0.82rem"}}>
                          {order.items?.map((item, i) => (
                            <p key={i} style={{margin:0}}>{item.name} ×{item.qty}</p>
                          ))}
                        </td>
                        <td className="adm-table__price">${Number(order.total).toFixed(2)}</td>
                        <td style={{fontSize:"0.82rem",color:"#888"}}>{order.paymentMethod || "COD"}</td>
                        <td>
                          <span className={`adm-badge${order.status === "confirmed" ? " adm-badge--green" : ""}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {order.status === "pending" && (
                            <button
                              className="adm-btn adm-btn--sm adm-btn--gold"
                              onClick={() => confirmOrder(order.id)}
                            >
                              Confirm
                            </button>
                          )}
                          {order.status === "confirmed" && (
                            <span style={{fontSize:"0.8rem",color:"#4caf50"}}>✓ Confirmed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <div>
            <div className="adm-main__header" style={{marginBottom:"1.5rem"}}>
              <div>
                <h2>Reservations</h2>
                <p>
                  {reservations.length} total
                  {pendingResCount > 0 && (
                    <span style={{color:"#c8a96e",marginLeft:"8px"}}>
                      · {pendingResCount} pending approval
                    </span>
                  )}
                </p>
              </div>
            </div>
            {resLoading ? (
              <div className="adm-loading-inline"><div className="adm-spinner" /></div>
            ) : reservations.length === 0 ? (
              <div className="adm-empty">No reservations yet.</div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Date & Time</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(res => (
                      <tr
                        key={res.id}
                        style={{cursor:"pointer"}}
                        onClick={() => setSelectedRes(res)}
                      >
                        <td>
                          {res.displayName && (
                            <p style={{margin:0,fontSize:"0.85rem",fontWeight:500}}>{res.displayName}</p>
                          )}
                          <p style={{margin:0,fontSize:"0.78rem",color:"#666"}}>{res.email}</p>
                        </td>
                        <td style={{fontSize:"0.85rem",maxWidth:"180px"}}>{res.productName}</td>
                        <td style={{fontSize:"0.85rem",whiteSpace:"nowrap"}}>
                          <p style={{margin:0}}>{res.date}</p>
                          <p style={{margin:0,color:"#888",fontSize:"0.78rem"}}>{formatTime(res.time)}</p>
                        </td>
                        <td style={{fontSize:"0.8rem",color:"#888",maxWidth:"140px"}}>
                          {res.notes
                            ? (res.notes.length > 50 ? res.notes.slice(0, 50) + "…" : res.notes)
                            : "—"}
                        </td>
                        <td>
                          <span className={`adm-badge${res.status === "approved" ? " adm-badge--green" : res.status === "rejected" ? " adm-badge--red" : ""}`}>
                            {res.status}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          {res.status === "pending" && (
                            <div style={{display:"flex",gap:"6px"}}>
                              <button
                                className="adm-btn adm-btn--sm adm-btn--gold"
                                onClick={() => updateReservation(res.id, "approved")}
                              >
                                Approve
                              </button>
                              <button
                                className="adm-btn adm-btn--sm adm-btn--danger"
                                onClick={() => updateReservation(res.id, "rejected")}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {res.status !== "pending" && (
                            <span style={{fontSize:"0.8rem",color:"#555"}}>Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products Table */}
        {activeTab === "products" && (
          loading ? (
          <div className="adm-loading-inline"><div className="adm-spinner" /></div>
        ) : products.length === 0 ? (
          <div className="adm-empty">No products yet. Add your first one!</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    {editingId === product.id ? (
                      <>
                        <td>
                          <input className="adm-table__input" value={editForm.image || ""} onChange={e => setEditForm(f => ({...f, image: e.target.value}))} placeholder="Image URL" />
                        </td>
                        <td>
                          <input className="adm-table__input" value={editForm.name || ""} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} />
                        </td>
                        <td>
                          <input className="adm-table__input" value={editForm.category || ""} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} />
                        </td>
                        <td>
                          <input className="adm-table__input adm-table__input--price" type="number" step="0.01" value={editForm.price || ""} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} />
                        </td>
                        <td>
                          <input className="adm-table__input" value={editForm.link || ""} onChange={e => setEditForm(f => ({...f, link: e.target.value}))} />
                        </td>
                        <td className="adm-table__actions">
                          <button className="adm-btn adm-btn--sm adm-btn--gold" onClick={saveEdit} disabled={saving}>{saving ? "..." : "Save"}</button>
                          <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => setEditingId(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {product.image
                            ? <img src={product.image} alt={product.name} className="adm-table__img" />
                            : <div className="adm-table__no-img">No img</div>}
                        </td>
                        <td className="adm-table__name">{product.name}</td>
                        <td><span className="adm-badge">{product.category}</span></td>
                        <td className="adm-table__price">${Number(product.price).toFixed(2)}</td>
                        <td className="adm-table__link">{product.link || "—"}</td>
                        <td className="adm-table__actions">
                          <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => startEdit(product)}>Edit</button>
                          <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => handleDelete(product.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </div>
  )
}