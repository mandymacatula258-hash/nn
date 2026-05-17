import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { useCart } from "../context/CartContext"
import "./ProductDetail.css"

import product1 from '../assets/Frenzy_fa__2_.png'
import product2 from '../assets/Frenzy_f3__1_.png'
import product3 from '../assets/Frenzy_flex.png'
import product4 from '../assets/Veyron.png'
import product5 from '../assets/Tauron_5.png'
import product6 from '../assets/Veyron_4.png'

const getLocalImage = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18×22") || n.includes("18x22")) return product1
  if (n.includes("f3") || n.includes("26×32") || n.includes("26x32")) return product2
  if (n.includes("flex") || n.includes("24×28") || n.includes("24x28") || n.includes("24x29") || n.includes("24×29")) return product3
  if (n.includes("dcr")) return product4
  if (n.includes("tauron")) return product5
  if (n.includes("ctr")) return product6
  return product1
}

/* ── Feature sections per product ── */
const FEATURE_SECTIONS = {
  fa: [
    { layout: "img-left",  title: "Multi-Coated Window",  body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan." },
    { layout: "img-bg",    title: "IP67 Waterproof",      body: "An IP67-rated scope is completely dustproof and can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions." },
    { layout: "img-right", title: "1500 G Shockproof",    body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  f3: [
    { layout: "img-right", title: "Extra Large Window",   body: "A large window provides an expansive viewing area, enhancing visibility and easing target acquisition by offering a broader field of view and allowing shooters to maintain sight of the dot.", accent: true },
    { layout: "img-left",  title: "Multi-Coated Window",  body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan." },
    { layout: "img-bg",    title: "IPX7 Waterproof",      body: "An IPX7-rated red dot can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions." },
    { layout: "img-right", title: "1500 G Shockproof",    body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  flex: [
    { layout: "img-right", title: "Extra Large Window",   body: "The 24×29 mm large window expands the field of view, allowing for faster and more precise target transitions while maintaining a clear sight picture.", accent: true },
    { layout: "img-left",  title: "Multi-Coated Window",  body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan." },
    { layout: "img-bg",    title: "IPX7 Waterproof",      body: "An IPX7-rated red dot can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions." },
    { layout: "img-right", title: "1500 G Shockproof",    body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  dcr: [
    { layout: "img-right", title: "LAREE HD Glass",              body: "The HD glass made with advanced LaREE (Lanthanide Rare Earth Element) lenses, delivering superior clarity and brightness and vividness." },
    { layout: "img-left",  title: "Fully Multi-Coated",          body: "Fully multi-coated lens reduce glare & reflection and improve light transmission & color contrast. It makes the image appear sharp and bright even in low-light conditions." },
    { layout: "img-right", title: "4x Zoom Factor",              body: "Zoom factor refers to the magnification range scope can achieve. It is crucial for adjusting the view to suit different distances and shooting scenarios, providing flexibility and precision." },
    { layout: "img-left",  title: "Turret Lock & Audible Clicks",body: "Turret lock w/ audible mechanical clicks for elevation and windage adjustments. Precisely know your click value for each adjustment, easy to remember and adjust." },
    { layout: "img-right", title: "Enhanced Side Focus Control", body: "The free included side focus wheel provides enhanced control, making adjustments smoother and allowing precise fine-tuning of your scope." },
    { layout: "img-bg",    title: "IP56 Waterproof",             body: "An IP56 rating means the rifle scope is fully dustproof and protected against powerful jets of water, making it suitable for use in demanding outdoor conditions." },
    { layout: "img-left",  title: "750 G Shockproof",            body: "750G shockproof is a rating that allows a scope can withstand impacts and drops from high altitudes, ensuring reliability in rugged outdoor use." },
    { layout: "img-right", title: "6-Level Illumination",        body: "Selectable 6-level illumination intensities enhance reticle visibility, adapting to a variety of lighting conditions." },
  ],
  tauron: [
    { layout: "img-right", title: "Japanese ED Glass",        body: "Japanese ED Glass minimizes chromatic aberrations for stunning sharpness, true-to-life color reproduction, and exceptional contrast even at maximum magnification, while fully multi-coated lenses enhance brightness and reduce glare." },
    { layout: "img-left",  title: "Japanese ED Glass",        body: "Japanese ED Glass minimizes chromatic aberrations for stunning sharpness, true-to-life color reproduction, and exceptional contrast even at maximum magnification, while fully multi-coated lenses enhance brightness and reduce glare." },
    { layout: "img-right", title: "1000G Shockproof",         body: "Boasting a 1000G shockproof rating, this scope is designed to endure recoils of up to 1000 times the force of gravity, ensuring unparalleled durability and precision." },
    { layout: "img-left",  title: "Side Focus from 10m",      body: "Stepless side focus allows effortless adjustment from 10 meters to infinity, providing precise, clear targeting at any distance." },
    { layout: "img-right", title: "Precise Elevation Control",body: "The turret system with zero stop and revolution indicator ensures smooth, precise elevation adjustments and secure dialing for long-range precision." },
  ],
  ctr: [
    { layout: "img-right", title: "LAREE HD Glass",              body: "The HD glass made with advanced LaREE (Lanthanide Rare Earth Element) lenses, delivering superior clarity and brightness and vividness." },
    { layout: "img-left",  title: "Fully Multi-Coated",          body: "Fully multi-coated lens reduce glare & reflection and improve light transmission & color contrast. It makes the image appear sharp and bright even in low-light conditions." },
    { layout: "img-right", title: "4x Zoom Factor",              body: "Zoom factor refers to the magnification range scope can achieve. It is crucial for adjusting the view to suit different distances and shooting scenarios, providing flexibility and precision." },
    { layout: "img-left",  title: "Turret Lock & Audible Clicks",body: "Turret lock w/ audible mechanical clicks for elevation and windage adjustments. Precisely know your click value for each adjustment, easy to remember and adjust." },
    { layout: "img-right", title: "Enhanced Side Focus Control", body: "The free included side focus wheel provides enhanced control, making adjustments smoother and allowing precise fine-tuning of your Veyron riflescope." },
    { layout: "img-bg",    title: "IP56 Waterproof",             body: "An IP56 rating means the rifle scope is fully dustproof and protected against powerful jets of water, making it suitable for use in demanding outdoor conditions." },
    { layout: "img-left",  title: "750 G Shockproof",            body: "750G shockproof is a rating that allows a scope can withstand impacts and drops from high altitudes, ensuring reliability in rugged outdoor use." },
    { layout: "img-right", title: "6-Level Illumination",        body: "Selectable 6-level illumination intensities enhance reticle visibility, adapting to a variety of lighting conditions." },
  ],
}

const getFeatureSections = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18x22") || n.includes("18×22")) return FEATURE_SECTIONS.fa
  if (n.includes("f3") || n.includes("26x32") || n.includes("26×32")) return FEATURE_SECTIONS.f3
  if (n.includes("flex"))   return FEATURE_SECTIONS.flex
  if (n.includes("dcr"))    return FEATURE_SECTIONS.dcr
  if (n.includes("tauron")) return FEATURE_SECTIONS.tauron
  if (n.includes("ctr"))    return FEATURE_SECTIONS.ctr
  return []
}

function FeatureSection({ image, section }) {
  const { layout, title, body, accent } = section
  const isBg = layout === "img-bg"
  const isLeft = layout === "img-left"

  if (isBg) return (
    <div className="pd-feat pd-feat--bg">
      <div className="pd-feat__overlay" />
      <div className={`pd-feat__text pd-feat__text--right${accent ? " pd-feat__text--accent" : ""}`}>
        <h2 className="pd-feat__title">{title}</h2>
        <p className="pd-feat__body">{body}</p>
      </div>
      <span className="pd-feat__star" aria-hidden="true">✦</span>
    </div>
  )

  return (
    <div className={`pd-feat pd-feat--split${isLeft ? " pd-feat--img-left" : ""}`}>
      <div className="pd-feat__img">
        <img src={image} alt={title} />
      </div>
      <div className={`pd-feat__text${accent ? " pd-feat__text--accent" : ""}`}>
        <h2 className="pd-feat__title">{title}</h2>
        <p className="pd-feat__body">{body}</p>
      </div>
      <span className="pd-feat__star" aria-hidden="true">✦</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id))
        if (snap.exists()) {
          const data = snap.data()
          setProduct({
            id: snap.id,
            ...data,
            image: data.image && data.image.startsWith("http")
              ? data.image
              : getLocalImage(data.name),
          })
        } else {
          navigate("/products")
        }
      } catch (e) {
        console.error("Failed to load product:", e)
        navigate("/products")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="pd__loading">
        <div className="pd__spinner" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="pd">
      {/* Back button */}
      <div className="pd__back-wrap">
        <button className="pd__back" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>
      </div>

      <div className="pd__layout">
        {/* Image panel */}
        <div className="pd__img-panel">
          <div className="pd__img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="pd__img"
              draggable={false}
              onError={(e) => { e.target.onerror = null; e.target.src = getLocalImage(product.name) }}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="pd__info-panel">
          <span className="pd__category">{product.category}</span>
          <h1 className="pd__name">{product.name}</h1>
          <p className="pd__price">${Number(product.price).toFixed(2)}</p>

          {product.description && (
            <p className="pd__description">{product.description}</p>
          )}

          <div className="pd__divider" />

          <div className="pd__actions">
            <button
              className={`pd__add-btn${added ? " pd__add-btn--added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart" : "+ Add to Cart"}
            </button>
            <button className="pd__buy-btn" onClick={() => { addToCart(product); navigate("/checkout") }}>
              Buy Now
            </button>
          </div>

          <div className="pd__meta">
            <div className="pd__meta-item">
              <span className="pd__meta-label">Category</span>
              <span className="pd__meta-value">{product.category || "—"}</span>
            </div>
            <div className="pd__meta-item">
              <span className="pd__meta-label">Availability</span>
              <span className="pd__meta-value pd__meta-value--green">In Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feature Sections ── */}
      {getFeatureSections(product.name).map((sec, i) => (
        <FeatureSection key={i} image={product.image} section={sec} />
      ))}

    </div>
  )
}