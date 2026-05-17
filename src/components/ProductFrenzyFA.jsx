import React, { useState, useEffect, useRef } from "react"
import "./ProductFrenzyFA.css"
import f1 from "../assets/f1.jpg"
import f2 from "../assets/f2.jpg"
import f3 from "../assets/f3.jpg"
import f4 from "../assets/f4.jpg"
import f5 from "../assets/f5.jpg"
import f6 from "../assets/f6.jpg"
import f7 from "../assets/f7.jpg"
import f8 from "../assets/f8.jpg"
import f9 from "../assets/f9.jpg"
import multicoated from "../assets/multicoated.jpg"
import ip67 from "../assets/ip67.png"
import shockproof from "../assets/shockproof.jpg"

// ─── Data ────────────────────────────────────────────────────────────────────

const THUMBNAILS = [f1, f2, f3, f4, f5, f6, f7, f8, f9]

const SPECS = [
  { label: "Reticle",    value: "2 MOA + 65 MOA" },
  { label: "Window",     value: "18 × 22 mm"      },
  { label: "Material",   value: "7075-T6"          },
  { label: "Waterproof", value: "IP67"             },
  { label: "Shock",      value: "1500 G"           },
  { label: "Model",      value: "SCRD-M75"         },
]

const FEATURES = [
  "Slim-Edge 18×22mm Window Design for a Wide Field of View and Rapid Target Acquisition",
  "Advanced Multi-Reticle System with 2 MOA Dot and 65 MOA Circle for Speed and Precision",
  "IP67 Enclosed Red Dot Sight for 9mm Pistols — Reliable in All-Weather Conditions",
  "7075-T6 Aluminum Alloy — Lightweight, Battle-Hardened, Built to Last",
  "Motion Sensor Auto On/Off Extends Battery Life Without Sacrificing Readiness",
]

const PANELS = [
  {
    num:       "01",
    tag:       "OPTICS",
    title:     ["Multi-Coated", "Window"],
    body:      "Full multi-coating across every optical surface. Distortion eliminated. Clarity maximized. Scratch, stain, and impact resistance built in.",
    image:     multicoated,   // multicoated.jpg — dark bg product shot
    flip:      false,
    fullBleed: false,
  },
  {
    num:       "02",
    tag:       "PROTECTION",
    title:     ["IP67", "Waterproof"],
    body:      "Completely sealed against dust. Submersible to 1 metre for 30 minutes. Rain, mud, river crossings — the Frenzy FA doesn't flinch.",
    image:     ip67,          // ip67.png — upload this to src/assets/
    flip:      false,
    fullBleed: true,
  },
  {
    num:       "03",
    tag:       "DURABILITY",
    title:     ["1500 G", "Shockproof"],
    body:      "Rated to absorb 1500G of impact force. Heavy recoil, hard drops, rough handling — zero stays zero. Built for the range, ready for beyond.",
    image:     shockproof,    // shockproof.png — upload this to src/assets/
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
      if (el.getBoundingClientRect().top < window.innerHeight + 100) {
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

// ─── Panel ────────────────────────────────────────────────────────────────────

function Panel({ panel }) {
  const [ref, visible] = useReveal()

  if (panel.fullBleed) {
    return (
      <section
        ref={ref}
        className={`fp-panel fp-panel--bleed${visible ? " fp-in" : ""}`}
      >
        <img
          src={panel.image}
          alt={panel.title.join(" ")}
          className="fp-bleed-bg"
          loading="lazy"
        />
        <div className="fp-bleed-ink" aria-hidden="true" />
        <div className="fp-bleed-body">
          <div className="fp-meta">
            <span className="fp-num">{panel.num}</span>
            <span className="fp-tag">{panel.tag}</span>
          </div>
          <h2 className="fp-title">
            {panel.title.map((line, i) => <span key={i}>{line}<br /></span>)}
          </h2>
          <p className="fp-body">{panel.body}</p>
        </div>
        <span className="fp-star" aria-hidden="true">✦</span>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className={[
        "fp-panel",
        "fp-panel--split",
        panel.flip ? "fp-panel--flip" : "",
        visible    ? "fp-in"          : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="fp-split-media">
        <img
          src={panel.image}
          alt={panel.title.join(" ")}
          className="fp-split-img"
          loading="lazy"
        />
      </div>
      <div className="fp-split-copy">
        <div className="fp-meta">
          <span className="fp-num">{panel.num}</span>
          <span className="fp-tag">{panel.tag}</span>
        </div>
        <h2 className="fp-title">
          {panel.title.map((line, i) => <span key={i}>{line}<br /></span>)}
        </h2>
        <p className="fp-body">{panel.body}</p>
      </div>
      <div className="fp-accent-rule" aria-hidden="true" />
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductFrenzyFA() {
  const [active, setActive] = useState(0)

  return (
    <div className="fp">

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="fp-hero">
        <div className="fp-hero-inner">

          {/* ── Left: info ── */}
          <div className="fp-hero-info">
            <p className="fp-eyebrow">Red Dot Sight &amp; Magnifier</p>

            <h1 className="fp-hero-title">
              <span className="fp-ht-small">Frenzy FA</span>
              <span className="fp-ht-big">18×22</span>
              <span className="fp-ht-sub">Enclosed MRT Red Dot Sight</span>
            </h1>

            <p className="fp-model">Model: SCRD-M75</p>

            <div className="fp-specs" role="list" aria-label="Product specifications">
              {SPECS.map((s) => (
                <div key={s.label} className="fp-spec" role="listitem">
                  <span className="fp-spec-val">{s.value}</span>
                  <span className="fp-spec-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            <ul className="fp-feats" aria-label="Key features">
              {FEATURES.map((f, i) => (
                <li key={i} className="fp-feat">
                  <span className="fp-dot" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: gallery ── */}
          <div className="fp-hero-gallery">
            <div className="fp-stage" role="img" aria-label="Frenzy FA product view">
              <div className="fp-glow" aria-hidden="true" />
              <img
                key={active}
                src={THUMBNAILS[active]}
                alt={`Frenzy FA — angle ${active + 1}`}
                className="fp-main-img"
              />
            </div>

            <div className="fp-thumbs" role="group" aria-label="Product image gallery">
              {THUMBNAILS.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View angle ${i + 1}`}
                  aria-pressed={active === i}
                  className={`fp-thumb${active === i ? " fp-thumb--on" : ""}`}
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
      <div className="fp-divider" aria-hidden="true">
        <span /><span>✦</span><span />
      </div>

      {/* ══ FEATURE PANELS ══════════════════════════════════════════════════ */}
      {PANELS.map((p, i) => (
        <Panel key={i} panel={p} />
      ))}

    </div>
  )
}