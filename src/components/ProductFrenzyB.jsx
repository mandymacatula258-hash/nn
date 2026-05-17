import React, { useState, useEffect, useRef } from "react"
import "./ProductFrenzyB.css"
import g1 from "../assets/g1.jpg"
import g2 from "../assets/g2.jpg"
import g3 from "../assets/g3.jpg"
import g4 from "../assets/g4.jpg"
import g5 from "../assets/g5.jpg"
import g6 from "../assets/g6.jpg"
import g7 from "../assets/g7.jpg"
import g8 from "../assets/g8.jpg"

import panelExtraLarge from "../assets/b1.png"
import panelMulticoat  from "../assets/b2.jpg"
import panelIpx7       from "../assets/b3.jpg"
import panelShockproof from "../assets/b4.jpg"

// ─── Data ────────────────────────────────────────────────────────────────────

const THUMBNAILS = [g1, g2, g3, g4, g5, g6, g7, g8]

const SPECS = [
  { label: "Reticle",    value: "2/6/65 MOA" },
  { label: "Window",     value: "26 × 32 mm" },
  { label: "Material",   value: "7075-T6"    },
  { label: "Waterproof", value: "IPX7"       },
  { label: "Shock",      value: "1500 G"     },
  { label: "Model",      value: "SCRD-M79"   },
]

const FEATURES = [
  "26×32mm / 1.02×1.26in Large Window Offers a Wide Field of View for Dynamic Shooting Competition",
  "Multi-Reticle System Integrates 2MOA, 6MOA, 65MOA Crosshair and Circle for Rapid Aiming in Diverse Scenarios",
  "Side Loading Battery Convenient and Quick to Change Battery without Re-Zeroing Each Time During Use",
  "IPX7 Waterproof, 1500G Shockproof, 7075-T6 Aluminum Alloy Ensure Exceptional and Extended Durability",
]

const PANELS = [
  {
    id:        "extra-large",
    title:     "Extra Large Window",
    body:      "A large window provides an expansive viewing area, enhancing visibility and easing target acquisition by offering a broader field of view and allowing shooters to maintain sight of the dot.",
    image:     panelExtraLarge,
    flip:      false,
    fullBleed: false,
  },
  {
    id:        "multicoat",
    title:     "Multi-Coated Window",
    body:      "The multi-coated window minimizes distortion and maximizes clarity while providing extra protection against scratches, stains, and damage, extending the product's durability and lifespan.",
    image:     panelMulticoat,
    flip:      false,
    fullBleed: false,
  },
  {
    id:        "ipx7",
    title:     "IPX7 Waterproof",
    body:      "An IPX7-rated red dot can withstand submersion in water up to 1 meter deep for 30 minutes, ensuring it remains protected in harsh environmental conditions.",
    image:     panelIpx7,
    flip:      false,
    fullBleed: true,
  },
  {
    id:        "shockproof",
    title:     "1500 G Shockproof",
    body:      "A 1500G shockproof rating ensures the red dot withstands heavy recoil and rugged impacts — maintaining zero in the toughest conditions.",
    image:     panelShockproof,
    flip:      true,
    fullBleed: false,
  },
]

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) { setVisible(true); return }
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight + 200) {
        setVisible(true)
        window.removeEventListener("scroll", check)
      }
    }
    const timer = setTimeout(check, 100)
    window.addEventListener("scroll", check, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", check)
    }
  }, [])

  return [ref, visible]
}

// ─── Split Panel ──────────────────────────────────────────────────────────────

function SplitPanel({ panel }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={[
        "fpb-panel",
        panel.flip ? "fpb-panel--flip" : "",
        visible    ? "fpb-in"          : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="fpb-panel-media">
        {panel.image
          ? <img src={panel.image} alt={panel.title} className="fpb-panel-img" loading="lazy" />
          : <div className="fpb-panel-ph"><span>{panel.title}</span></div>
        }
      </div>
      <div className="fpb-panel-copy">
        <h2 className="fpb-panel-title">{panel.title}</h2>
        <p  className="fpb-panel-body">{panel.body}</p>
      </div>
    </div>
  )
}

// ─── Full-Bleed Panel ─────────────────────────────────────────────────────────

function BleedPanel({ panel }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`fpb-bleed${visible ? " fpb-in" : ""}`}
    >
      {panel.image
        ? <img src={panel.image} alt={panel.title} className="fpb-bleed-bg" loading="lazy" />
        : <div className="fpb-bleed-bg fpb-bleed-ph" />
      }
      <div className="fpb-bleed-ink" />
      <div className="fpb-bleed-body">
        <h2 className="fpb-panel-title">{panel.title}</h2>
        <p  className="fpb-panel-body">{panel.body}</p>
      </div>
      <span className="fpb-bleed-star" aria-hidden="true">✦</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductFrenzyB() {
  const [active, setActive] = useState(0)

  return (
    <div className="fpb">

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="fpb-hero">
        <div className="fpb-hero-inner">

          {/* Left: info */}
          <div className="fpb-hero-info">
            <p className="fpb-eyebrow">Red Dot Sight</p>

            <h1 className="fpb-hero-title">
              <span className="fpb-ht-small">Frenzy F3</span>
              <span className="fpb-ht-big">26×32</span>
              <span className="fpb-ht-sub">MRT Red Dot Sight</span>
            </h1>

            <p className="fpb-model">Model: SCRD-M79</p>

            <div className="fpb-specs" role="list" aria-label="Product specifications">
              {SPECS.map((s) => (
                <div key={s.label} className="fpb-spec" role="listitem">
                  <span className="fpb-spec-val">{s.value}</span>
                  <span className="fpb-spec-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            <ul className="fpb-feats" aria-label="Key features">
              {FEATURES.map((f, i) => (
                <li key={i} className="fpb-feat">
                  <span className="fpb-dot" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: gallery */}
          <div className="fpb-hero-gallery">
            <div className="fpb-stage" role="img" aria-label="Frenzy F3 product view">
              <div className="fpb-glow" aria-hidden="true" />
              <img
                key={active}
                src={THUMBNAILS[active]}
                alt={`Frenzy F3 — angle ${active + 1}`}
                className="fpb-main-img"
              />
            </div>

            <div className="fpb-thumbs" role="group" aria-label="Product image gallery">
              {THUMBNAILS.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View angle ${i + 1}`}
                  aria-pressed={active === i}
                  className={`fpb-thumb${active === i ? " fpb-thumb--on" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <img src={img} alt="" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══ DIVIDER ═════════════════════════════════════════════════════════ */}
      <div className="fpb-divider" aria-hidden="true">
        <span /><span>✦</span><span />
      </div>

      {/* ══ FEATURE PANELS ══════════════════════════════════════════════════ */}
      {PANELS.map((p) =>
        p.fullBleed
          ? <BleedPanel key={p.id} panel={p} />
          : <SplitPanel key={p.id} panel={p} />
      )}

    </div>
  )
}