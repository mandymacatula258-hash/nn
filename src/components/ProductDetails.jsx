import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from "../firebase"
import {
  doc, getDoc, collection, addDoc, query, where, onSnapshot, serverTimestamp
} from "firebase/firestore"
import { useCart } from "../context/CartContext"
import "./ProductDetails.css"

import product1  from '../assets/f1.jpg'
import f2        from '../assets/f2.jpg'
import f3        from '../assets/f3.jpg'
import f4        from '../assets/f4.jpg'
import f5        from '../assets/f5.jpg'
import f6        from '../assets/f6.jpg'
import f7        from '../assets/f7.jpg'
import f8        from '../assets/f8.jpg'
import f9        from '../assets/f9.jpg'
import product2  from '../assets/g1.jpg'
import multicoated from '../assets/multicoated.jpg'
import ip67        from '../assets/ip67.png'
import shockproof  from '../assets/shockproof.jpg'
import b1          from '../assets/b1.png'
import b2          from '../assets/b2.jpg'
import b3          from '../assets/b3.jpg'
import b4          from '../assets/b4.jpg'
import g2        from '../assets/g2.jpg'
import g3        from '../assets/g3.jpg'
import g4        from '../assets/g4.jpg'
import g5        from '../assets/g5.jpg'
import g6        from '../assets/g6.jpg'
import g7        from '../assets/g7.jpg'
import g8        from '../assets/g8.jpg'

const PLACEHOLDER = "https://placehold.co/400x300?text=Product+Image"
const product3 = PLACEHOLDER
const product4 = PLACEHOLDER
const product5 = PLACEHOLDER
const product6 = PLACEHOLDER

const getLocalImage = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18×22") || n.includes("18x22")) return product1
  if (n.includes("f3") || n.includes("26×32") || n.includes("26x32")) return product2
  return PLACEHOLDER
}

const THUMBNAILS = {
  fa:     [product1, f2, f3, f4, f5, f6, f7, f8, f9],
  f3:     [product2, g2, g3, g4, g5, g6, g7, g8],
  flex:   [product3, product3, product3, product3, product3, product3],
  dcr:    [product4, product4, product4, product4, product4],
  tauron: [product5, product5, product5, product5, product5],
  ctr:    [product6, product6, product6, product6, product6],
}

const getThumbnails = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18x22") || n.includes("18×22")) return THUMBNAILS.fa
  if (n.includes("f3") || n.includes("26x32") || n.includes("26×32")) return THUMBNAILS.f3
  if (n.includes("flex"))   return THUMBNAILS.flex
  if (n.includes("dcr"))    return THUMBNAILS.dcr
  if (n.includes("tauron")) return THUMBNAILS.tauron
  if (n.includes("ctr"))    return THUMBNAILS.ctr
  return [product1]
}

const getModel = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18x22") || n.includes("18×22")) return "SCRO-M75"
  if (n.includes("f3") || n.includes("26x32") || n.includes("26×32")) return "SCRO-M79"
  if (n.includes("flex"))   return "SCRO-M76"
  if (n.includes("dcr"))    return "SCFF-78"
  if (n.includes("tauron")) return "SCOL-69"
  if (n.includes("ctr"))    return "SCFF-73"
  return ""
}

const BULLETS = {
  fa: [
    "Slim-Edge 18×22mm Window Design Delivers a Wide Field of View for Rapid Target Acquisition",
    "Advanced Multi-Reticle System with 2 MOA Dot and 65 MOA Circle for Speed and Precision",
    "Enclosed Red Dot Sight for 9mm Pistols with IP67 Rating for Reliable All-Weather Performance",
    "7075-T6 Aluminum Alloy Construction Ensures Lightweight Strength and Long-Term Durability",
    "Motion Sensor Activation Automatically Powers On and Off to Extend Battery Life",
  ],
  f3: [
    "26×32mm / 1.02×1.26in Large Window Offers a Wide Field of View for Dynamic Shooting Competition",
    "Multi-Reticle System Integrates 2MOA, 6MOA, 65MOA Crosshair and Circle for Rapid Aiming in Diverse Scenarios",
    "Side Loading Battery Convenient and Quick to Change Battery without Re-Zeroing Each Time During Use",
    "IPX7 Waterproof, 1500G Shockproof, 7075-T6 Aluminum Alloy Ensure Exceptional and Extended Durability",
  ],
  flex: [
    "24×29 mm Large Window Expands Field of View for Faster, More Accurate Target Transitions",
    "Multi-Reticle System Integrates 2MOA Dot, 64MOA Circle and 82MOA Crosshair for Rapid Aiming",
    "Enclosed Red Dot Sight for 9mm Pistols with IP67 Rating for Reliable All-Weather Performance",
    "7075-T6 Aluminum Construction Enhances Durability with 1500 G Shock Resistance for Pistol Use",
    "Side Loading Battery Enables Quick Replacement Without Losing Zero, Minimizing Downtime",
  ],
  dcr: [
    "FFP VHE-1 MIL Etched Glass Reticle w/ 0.05MIL Illuminated Floating Dot, Dedicated Crosshair 10X Mil for Mid to Long Range",
    "Upgraded LaREE HD Glass w/ Fully Multi-Coating Delivers Brighter, Sharper Imaging Compared with the Veyron Gen I",
    "1/10MIL Turrets Offer More Precise Dialing w/ Crisper Audible Clicks, 50mm Total Provides Elevation Ranges up to 100MIL",
    "Compact 231mm / 9.09in & Lightweight 640g / 22.7oz Build Ideal for Mid- to Close-Range All Platforms & PCP Compacts",
    "6-Level Illumination for Low-Light Visibility, Elevation & Windage Turret Lock Function Prevents Unintentional Adjustment",
  ],
  tauron: [
    "SFP VCO-5 MIL Reticle Featuring a Floating 0.05 MIL Illuminated Center Dot and 8-Gear Illumination for Precise Aiming",
    "10× Zoom Ratio with Up to 50× Magnification, Optimized for Field Target Competition, F-Class, and Benchrest Shooting",
    "Japanese ED Glass with Fully Multi-Coated LaREE-HQ Lenses for Up to 92% Light Transmission & Clear, Vivid Imaging",
    "Turret System with Zero Stop, Turret Lock & Revolution Indicator on Elevation, Plus Locking Windage for Secure Dialing",
  ],
  ctr: [
    "FFP VVE-1 MIL Etched Glass Reticle w/ 0.05MIL Illuminated Floating Dot, Christmas Tree Pattern for Fast Follow-Up Correction",
    "Upgraded LaREE HD Glass w/ Fully Multi-Coating Delivers Brighter, Sharper Imaging Compared with the Veyron Gen I",
    "1/10MIL Turrets Offer More Precise Dialing w/ Crisper Audible Clicks, 30mm Tube Provides Elevation Ranges up to 100MIL",
    "Compact 231mm / 9.09in & Lightweight 640g / 22.7oz Build Ideal for Mid- to Close-Range All Platforms & PCP Compacts",
    "6-Level Illumination for Low-Light Visibility, Elevation & Windage Turret Lock Function Prevents Unintentional Adjustment",
  ],
}

const getBullets = (name = "") => {
  const n = name.toLowerCase()
  if (n.includes("fa") || n.includes("18x22") || n.includes("18×22")) return BULLETS.fa
  if (n.includes("f3") || n.includes("26x32") || n.includes("26×32")) return BULLETS.f3
  if (n.includes("flex"))   return BULLETS.flex
  if (n.includes("dcr"))    return BULLETS.dcr
  if (n.includes("tauron")) return BULLETS.tauron
  if (n.includes("ctr"))    return BULLETS.ctr
  return []
}

const FEATURE_SECTIONS = {
  fa: [
    { layout: "img-left",  title: "Multi-Coated Window", body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan." },
    { layout: "img-bg",    title: "IP67 Waterproof",     body: "An IP67-rated scope is completely dustproof and can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions.", textAlign: "right" },
    { layout: "img-right", title: "1500 G Shockproof",   body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  f3: [
    { layout: "img-right", title: "EXTRA LARGE WINDOW",  body: "A large window provides an expansive viewing area, enhancing visibility and easing target acquisition by offering a broader field of view and allowing shooters to maintain sight of the dot.", caps: true, light: true },
    { layout: "img-left",  title: "Multi-Coated Window", body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan." },
    { layout: "img-bg",    title: "IPX7 Waterproof",     body: "An IPX7-rated red dot can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions.", textAlign: "right" },
    { layout: "img-right", title: "1500 G Shockproof",   body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  flex: [
    { layout: "img-right", title: "EXTRA LARGE WINDOW", body: "The 24×29 mm large window expands the field of view, allowing for faster and more precise target transitions while maintaining a clear sight picture.", caps: true, light: true },
    { layout: "img-left",  title: "EXTRA LARGE WINDOW", body: "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan.", caps: true },
    { layout: "img-bg",    title: "EXTRA LARGE WINDOW", body: "An IPXZ-rated red dot can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions.", caps: true, textAlign: "right" },
    { layout: "img-right", title: "1500 G Shockproof",  body: "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions." },
  ],
  dcr: [
    { layout: "img-right", title: "LAREE HD Glass",              body: "The HD glass made with advanced LaREE (Lanthanide Rare Earth Element) lenses, delivering superior clarity and brightness and vividness.", light: true },
    { layout: "img-left",  title: "Fully Multi-Coated",          body: "Fully multi-coated lens reduce glare & reflection and improve light transmission & color contrast. It makes the image appear sharp and bright even in low-light conditions." },
    { layout: "img-right", title: "4x Zoom Factor",              body: "Zoom factor refers to the magnification range scope can achieve. It is crucial for adjusting the view to suit different distances and shooting scenarios, providing flexibility and precision.", light: true },
    { layout: "img-left",  title: "Turret Lock & Audible Clicks",body: "Turret lock w/ audible mechanical clicks for elevation and windage adjustments. Precisely know your click value for each adjustment, easy to remember and adjust.", light: true },
    { layout: "img-right", title: "Enhanced Side Focus Control", body: "The free included side focus wheel provides enhanced control, making adjustments smoother and allowing precise fine-tuning of your scope.", light: true },
    { layout: "img-right", title: "Compact Design",              body: "The compact and lightweight design of the rifle enhances portability, enables quick target acquisition, and facilitates easier handling, maintaining control and accuracy for extended use.", light: true },
    { layout: "img-bg",    title: "IP56 Waterproof",             body: "An IP56 rating means the rifle scope is fully dustproof and protected against powerful jets of water, making it suitable for use in demanding outdoor conditions.", textAlign: "right" },
    { layout: "img-bg",    title: "750 G Shockproof",            body: "750G shockproof is a rating that allows a scope can withstand impacts and drops from high altitudes, ensuring reliability in rugged outdoor use.", textAlign: "left" },
    { layout: "img-right", title: "6-Level Illumination",        body: "Selectable 6-level illumination intensities enhance reticle visibility, adapting to a variety of lighting conditions.", light: true },
  ],
  tauron: [
    { layout: "img-left",  title: "Japanese ED Glass",        body: "Japanese ED Glass minimizes chromatic aberrations for stunning sharpness, true-to-life color reproduction, and exceptional contrast even at maximum magnification, while fully multi-coated lenses enhance brightness and reduce glare." },
    { layout: "img-right", title: "Japanese ED Glass",        body: "Japanese ED Glass minimizes chromatic aberrations for stunning sharpness, true-to-life color reproduction, and exceptional contrast even at maximum magnification, while fully multi-coated lenses enhance brightness and reduce glare.", light: true },
    { layout: "img-bg",    title: "1000G Shockproof",         body: "Boasting a 1000G shockproof rating, this scope is designed to endure recoils of up to 1000 times the force of gravity, ensuring unparalleled durability and precision.", textAlign: "left" },
    { layout: "img-right", title: "Side Focus from 10m",      body: "Stepless side focus allows effortless adjustment from 10 meters to infinity, providing precise, clear targeting at any distance. Its smooth, continuous control ensures rapid focus changes without preset stops.", light: true },
    { layout: "img-right", title: "Precise Elevation Control",body: "The turret system with zero stop and revolution indicator ensures smooth, precise elevation adjustments and secure dialing for long-range precision.", light: true },
  ],
  ctr: [
    { layout: "img-right", title: "LAREE HD Glass",              body: "The HD glass made with advanced LaREE (Lanthanide Rare Earth Element) lenses, delivering superior clarity and brightness and vividness.", light: true },
    { layout: "img-left",  title: "Fully Multi-Coated",          body: "Fully multi-coated lens reduce glare & reflection and improve light transmission & color contrast. It makes the image appear sharp and bright even in low-light conditions." },
    { layout: "img-right", title: "4x Zoom Factor",              body: "Zoom factor refers to the magnification range scope can achieve. It is crucial for adjusting the view to suit different distances and shooting scenarios, providing flexibility and precision.", light: true },
    { layout: "img-left",  title: "Turret Lock & Audible Clicks",body: "Turret lock w/ audible mechanical clicks for elevation and windage adjustments. Precisely know your click value for each adjustment, easy to remember and adjust.", light: true },
    { layout: "img-right", title: "Enhanced Side Focus Control", body: "The free included side focus wheel provides enhanced control, making adjustments smoother and allowing precise fine-tuning of your Veyron riflescope.", light: true },
    { layout: "img-bg",    title: "IP56 Waterproof",             body: "An IP56 rating means the rifle scope is fully dustproof and protected against powerful jets of water, making it suitable for use in demanding outdoor conditions.", textAlign: "right" },
    { layout: "img-bg",    title: "750 G Shockproof",            body: "750G shockproof is a rating that allows a scope can withstand impacts and drops from high altitudes, ensuring reliability in rugged outdoor use.", textAlign: "left" },
    { layout: "img-right", title: "6-Level Illumination",        body: "Selectable 6-level illumination intensities enhance reticle visibility, adapting to a variety of lighting conditions.", light: true },
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

/* ─── Feature Section Component ─────────────────────────────────────────── */
function FeatureSection({ image, section }) {
  const { layout, title, body, caps, light, textAlign = "right" } = section

  if (layout === "img-bg") {
    return (
      <div className={`pd-feat pd-feat--bg${light ? " pd-feat--light" : ""}`}>
        <img src={image} alt="" className="pd-feat__bg-img" aria-hidden="true" />
        <div className="pd-feat__bg-overlay" />
        <div className={`pd-feat__bg-text pd-feat__bg-text--${textAlign}`}>
          <h2 className={`pd-feat__title${caps ? " pd-feat__title--caps" : ""}`}>{title}</h2>
          <p className="pd-feat__body">{body}</p>
        </div>
        <span className="pd-feat__star" aria-hidden="true">✦</span>
      </div>
    )
  }

  if (layout === "img-left") {
    return (
      <div className={`pd-feat pd-feat--split${light ? " pd-feat--light" : ""}`}>
        <div className="pd-feat__img-col">
          <img src={image} alt={title} className="pd-feat__img" />
        </div>
        <div className="pd-feat__text-col">
          <h2 className={`pd-feat__title${caps ? " pd-feat__title--caps" : ""}`}>{title}</h2>
          <p className="pd-feat__body">{body}</p>
        </div>
        <span className="pd-feat__star" aria-hidden="true">✦</span>
      </div>
    )
  }

  if (layout === "img-right") {
    return (
      <div className={`pd-feat pd-feat--split pd-feat--reversed${light ? " pd-feat--light" : ""}`}>
        <div className="pd-feat__text-col">
          <h2 className={`pd-feat__title${caps ? " pd-feat__title--caps" : ""}`}>{title}</h2>
          <p className="pd-feat__body">{body}</p>
        </div>
        <div className="pd-feat__img-col">
          <img src={image} alt={title} className="pd-feat__img" />
        </div>
        <span className="pd-feat__star" aria-hidden="true">✦</span>
      </div>
    )
  }

  return null
}

/* ─── Reservation Status Banner ─────────────────────────────────────────── */
function ReservationBanner({ status, resData }) {
  if (status === "pending") {
    return (
      <div className="pd__res-banner pd__res-banner--pending">
        <span className="pd__res-banner__icon">🕐</span>
        <div>
          <strong>Reservation Pending</strong>
          <p>Your request for product testing is awaiting admin approval. We'll update this once confirmed.</p>
          {resData && (
            <p className="pd__res-banner__detail">
              Scheduled: {resData.date} at {resData.time}
            </p>
          )}
        </div>
      </div>
    )
  }
  if (status === "approved") {
    return (
      <div className="pd__res-banner pd__res-banner--approved">
        <span className="pd__res-banner__icon">✅</span>
        <div>
          <strong>Reservation Approved!</strong>
          <p>Your in-store product testing session has been confirmed. Please visit us on your scheduled date.</p>
          {resData && (
            <p className="pd__res-banner__detail">
              📅 {resData.date} at {resData.time}
            </p>
          )}
        </div>
      </div>
    )
  }
  if (status === "rejected") {
    return (
      <div className="pd__res-banner pd__res-banner--rejected">
        <span className="pd__res-banner__icon">❌</span>
        <div>
          <strong>Reservation Not Approved</strong>
          <p>Unfortunately we couldn't accommodate your request. Please contact us for more information or try a different date.</p>
        </div>
      </div>
    )
  }
  return null
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [added, setAdded]             = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [showReserve, setShowReserve] = useState(false)
  const [resForm, setResForm]         = useState({ date: "", time: "", notes: "" })
  const [resLoading, setResLoading]   = useState(false)
  const [resStatus, setResStatus]     = useState(null)   // real-time status
  const [resData, setResData]         = useState(null)   // full reservation doc
  const [resError, setResError]       = useState("")

  // ── Load product ──
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, "products", id))
        if (snap.exists()) {
          const data = snap.data()
          setProduct({
            id: snap.id,
            ...data,
            image: data.image && (data.image.startsWith("http") || data.image.startsWith("data:"))
              ? data.image
              : getLocalImage(data.name),
          })
        } else {
          navigate("/product")
        }
      } catch (e) {
        console.error("Failed to load product:", e)
        navigate("/product")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // ── Real-time reservation listener ──
  // Uses onSnapshot so the banner updates the moment admin approves/rejects,
  // without the user needing to refresh the page.
  useEffect(() => {
    const user = auth.currentUser
    if (!user || !id) return

    const q = query(
      collection(db, "reservations"),
      where("uid", "==", user.uid),
      where("productId", "==", id)
    )

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const res = snap.docs[0].data()
        setResStatus(res.status)
        setResData(res)
      } else {
        setResStatus(null)
        setResData(null)
      }
    })

    return () => unsub()
  }, [id])

  const handleReserve = async () => {
    const user = auth.currentUser
    if (!user) { navigate("/login"); return }
    if (!resForm.date || !resForm.time) {
      setResError("Please select a date and time.")
      return
    }
    setResLoading(true)
    setResError("")
    try {
      await addDoc(collection(db, "reservations"), {
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName || "",
        productId:   id,
        productName: product.name,
        date:        resForm.date,
        time:        resForm.time,
        notes:       resForm.notes,
        status:      "pending",
        createdAt:   serverTimestamp(),
      })
      // onSnapshot will automatically update resStatus to "pending"
      setShowReserve(false)
      setResForm({ date: "", time: "", notes: "" })
    } catch (e) {
      setResError("Failed to submit reservation. Please try again.")
    } finally {
      setResLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Minimum date: tomorrow (can't reserve for today)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  if (loading) return (
    <div className="pd__loading">
      <div className="pd__spinner" />
    </div>
  )

  if (!product) return null

  const thumbnails  = getThumbnails(product.name)
  const bullets     = getBullets(product.name)
  const model       = getModel(product.name)
  const features    = getFeatureSections(product.name)
  const activeImage = thumbnails[activeThumb] || product.image

  return (
    <div className="pd">

      <div className="pd__back-wrap">
        <button className="pd__back" onClick={() => navigate("/product")}>
          ← Back to Products
        </button>
      </div>

      <div className="pd__layout">

        {/* Left: image + thumbnails */}
        <div className="pd__img-panel">
          <div className="pd__img-wrap">
            <img
              src={activeImage}
              alt={product.name}
              className="pd__img"
              draggable={false}
              onError={(e) => { e.target.onerror = null; e.target.src = getLocalImage(product.name) }}
            />
          </div>
          {thumbnails.length > 1 && (
            <div className="pd__thumbs">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`pd__thumb${activeThumb === i ? " pd__thumb--active" : ""}`}
                  onClick={() => setActiveThumb(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={thumb} alt="" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: info */}
        <div className="pd__info-panel">
          <h1 className="pd__name">{product.name}</h1>
          {model && <p className="pd__model">Model: {model}</p>}

          {bullets.length > 0 ? (
            <ul className="pd__bullets">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : product.description ? (
            <p className="pd__description">{product.description}</p>
          ) : null}

          <div className="pd__divider" />

          <p className="pd__price">${Number(product.price).toFixed(2)}</p>

          <div className="pd__actions">
            <button
              className={`pd__add-btn${added ? " pd__add-btn--added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? "✓ Added to Cart" : "+ Add to Cart"}
            </button>
            <button
              className="pd__buy-btn"
              onClick={() => { addToCart(product); navigate("/checkout") }}
            >
              Buy Now
            </button>
          </div>

          {/* Reservation status banner — updates in real-time via onSnapshot */}
          <ReservationBanner status={resStatus} resData={resData} />

          {/* Reserve button — hidden once user has any reservation */}
          {!resStatus && (
            <button className="pd__reserve-btn" onClick={() => setShowReserve(true)}>
              📅 Reserve for In-Store Testing
            </button>
          )}

          {/* Cancel/change reservation option for rejected status */}
          {resStatus === "rejected" && (
            <button
              className="pd__reserve-btn"
              style={{ marginTop: "8px" }}
              onClick={() => {
                setResStatus(null)
                setResData(null)
                setShowReserve(true)
              }}
            >
              📅 Try a Different Date
            </button>
          )}

          {/* Reservation modal */}
          {showReserve && (
            <div className="pd__res-overlay" onClick={() => setShowReserve(false)}>
              <div className="pd__res-modal" onClick={e => e.stopPropagation()}>
                <div className="pd__res-modal__header">
                  <h3>Reserve for In-Store Testing</h3>
                  <button className="pd__res-modal__close" onClick={() => setShowReserve(false)}>✕</button>
                </div>
                <p className="pd__res-modal__product">{product.name}</p>

                <p className="pd__res-modal__info">
                  Visit our physical store to try this product before you buy. Select your preferred date and time — our team will confirm your reservation.
                </p>

                <div className="pd__res-field">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    value={resForm.date}
                    min={minDateStr}
                    onChange={e => setResForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="pd__res-field">
                  <label>Preferred Time *</label>
                  <input
                    type="time"
                    value={resForm.time}
                    min="09:00"
                    max="18:00"
                    onChange={e => setResForm(f => ({ ...f, time: e.target.value }))}
                  />
                  <span className="pd__res-field__hint">Store hours: 9:00 AM – 6:00 PM</span>
                </div>
                <div className="pd__res-field">
                  <label>Notes (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="E.g. specific features you want to test, questions for our staff..."
                    value={resForm.notes}
                    onChange={e => setResForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                {resError && <p className="pd__res-error">{resError}</p>}
                <div className="pd__res-modal__actions">
                  <button className="pd__res-cancel" onClick={() => setShowReserve(false)}>Cancel</button>
                  <button className="pd__res-submit" onClick={handleReserve} disabled={resLoading}>
                    {resLoading ? "Submitting..." : "Submit Reservation"}
                  </button>
                </div>
              </div>
            </div>
          )}

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

      {/* Feature Sections */}
      {features.map((sec, i) => (
        <FeatureSection key={i} image={product.image} section={sec} />
      ))}

    </div>
  )
}