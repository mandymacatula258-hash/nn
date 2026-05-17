import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"
import "./ProductPage.css"

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

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) { setVisible(true); return }
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight + 80) {
        setVisible(true)
        window.removeEventListener("scroll", check)
      }
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [])
  return [ref, visible]
}

function ProductCard({ product, index }) {
  const [ref, visible] = useReveal()

  return (
    <article
      ref={ref}
      className={`pp-card${visible ? " pp-card--in" : ""}`}
      style={{ "--delay": `${index * 0.1}s` }}
    >
      <div className="pp-card-media">
        <img
          src={product.image}
          alt={product.name}
          className="pp-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = getLocalImage(product.name)
          }}
        />
        {product.category && (
          <span className="pp-card-tag">{product.category}</span>
        )}
        <div className="pp-card-overlay" aria-hidden="true" />
      </div>

      <div className="pp-card-body">
        <h2 className="pp-card-name">{product.name}</h2>
        <p className="pp-card-price">${Number(product.price).toFixed(2)}</p>
        {product.description && (
          <p className="pp-card-desc">{product.description}</p>
        )}
        <Link to={product.link || "#"} className="pp-card-btn">
          Learn More <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"))
        const data = snap.docs.map((d) => {
          const docData = d.data()
          return {
            id: d.id,
            ...docData,
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
    <div className="pp">

      {/* Hero */}
      <section className="pp-hero">
        <div className="pp-hero-bg" aria-hidden="true" />
        <div className="pp-hero-inner">
          <p className="pp-hero-eyebrow">IMPAQ OPTICS — LINEUP</p>
          <h1 className="pp-hero-title">Our Products</h1>
          <p className="pp-hero-sub">
            Premium optics engineered for precision.<br />
            Built for those who refuse to compromise.
          </p>
        </div>
        <div className="pp-hero-rule" aria-hidden="true">
          <span /><span>✦</span><span />
        </div>
      </section>

      {/* Grid */}
      <section className="pp-grid">
        {loading ? (
          <p className="pp-status">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="pp-status">No products found.</p>
        ) : (
          products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))
        )}
      </section>

    </div>
  )
}