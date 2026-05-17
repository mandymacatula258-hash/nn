import React, { useEffect, useRef } from 'react'
import heroImg from '../assets/hero.png'
import './Hero.css'

export default function Hero() {
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const els = [badgeRef.current, headingRef.current, subRef.current, ctaRef.current]
    els.forEach((el, i) => {
      if (!el) return
      el.style.animationDelay = `${0.2 + i * 0.18}s`
      el.classList.add('hero__animate-in')
    })
  }, [])

  return (
    <section className="hero" id="home">

      <div className="hero__bg">
        <img src={heroImg} alt="IMPAQ OPTICS" className="hero__bg-img" draggable={false} />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <span className="hero__badge" ref={badgeRef}>New Collection 2025</span>

        <h1 className="hero__heading" ref={headingRef}>
          See the World<br />
          <span className="hero__heading-accent">Differently.</span>
        </h1>

        <p className="hero__sub" ref={subRef}>
          Premium optics engineered for precision,<br />
          built for those who refuse to compromise.
        </p>

        <div className="hero__cta-group" ref={ctaRef}>
          <a href="#shop" className="hero__btn hero__btn--primary">
            <span>Get Started</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#about" className="hero__btn hero__btn--ghost">Learn More</a>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </div>

    </section>
  )
}