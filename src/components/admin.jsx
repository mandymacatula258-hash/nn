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
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "", category: "", price: "", image: "", link: "", description: ""
  })
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

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

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
      const ref = await addDoc(collection(db, "products"), {
        ...addForm,
        price: parseFloat(addForm.price),
        createdAt: serverTimestamp()
      })
      setProducts(prev => [...prev, { id: ref.id, ...addForm, price: parseFloat(addForm.price) }])
      setAddForm({ name: "", category: "", price: "", image: "", link: "", description: "" })
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
                  <label>Image URL</label>
                  <input value={addForm.image} onChange={e => setAddForm(f => ({...f, image: e.target.value}))} placeholder="https://... or /assets/1.png" />
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

        {/* Products Table */}
        {loading ? (
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
        )}
      </main>
    </div>
  )
}