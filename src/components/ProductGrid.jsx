import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import './ProductGrid.css'

export default function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Load products from Firestore ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"))
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error("Failed to load products:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section className="products" id="products">

      {/* Header */}
      <div className="products__header">
        <p className="products__tagline">New Product Push</p>
        <h2 className="products__title">Innovation Never Stops</h2>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#C8962A" }}>
          Loading products...
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
                  />
                </div>
              </div>
              <div className="products__card-bottom">
                <p className="products__card-name">{product.name}</p>
                <Link to={product.link || "#"} className="products__card-link">
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Section */}
      <div className="products__footer">
        <p className="products__footer-tagline">High-End Series Recommendation</p>
        <h2 className="products__footer-title">Precision-crafted for superior optical quality</h2>
      </div>

    </section>
  )
}