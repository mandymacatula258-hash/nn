import React from 'react'
import './AboutUs.css'
import about1 from '../assets/about1.png'
import about2 from '../assets/about2.png'
import about3 from '../assets/about3.png'
import about4 from '../assets/about4.png'

export default function AboutUs() {
  return (
    <div className="about">

      <section className="about__hero" style={{ backgroundImage: `url(${about1})` }}>
        <div className="about__hero-overlay" />
        <div className="about__hero-content">
          <h1 className="about__hero-title">About Us</h1>
          <p className="about__hero-sub">Create High-End Optical Products, Be the Industry Leading Optical Brand</p>
        </div>
      </section>

      <section className="about__intro">
        <div className="about__intro-inner">
          <div className="about__intro-text">
            <h2 className="about__intro-heading">IMPAQ OPTICS</h2>
            <p className="about__intro-body">
              Since 2007, Impaq Optics has dedicated itself to the design, manufacturing, and distribution
              of premium optics and innovative sighting systems across various fields of application,
              including hunting, defense, sporting, and competition. We are committed to providing
              high-quality optical products and exceptional customer service at competitive prices.
              With a broad range of product lines, we offer precision aiming solutions for short,
              medium, and long-range shooting scenarios.
            </p>
          </div>
          <div className="about__intro-image">
            <img src={about2} alt="Impaq Optics team in action" />
            <span className="about__intro-badge">IMPAQ OPTICS</span>
          </div>
        </div>
      </section>

      <section className="about__mvv" style={{ backgroundImage: `url(${about3})` }}>
        <div className="about__mvv-overlay" />
        <div className="about__mvv-inner">
          <div className="about__mvv-card">
            <h3 className="about__mvv-title">Our Mission</h3>
            <p className="about__mvv-text">To build the most valuable riflescope brand</p>
          </div>
          <div className="about__mvv-divider" />
          <div className="about__mvv-card">
            <h3 className="about__mvv-title">Our Vision</h3>
            <p className="about__mvv-text">To change the view of "Made in China" Riflescopes</p>
          </div>
          <div className="about__mvv-divider" />
          <div className="about__mvv-card">
            <h3 className="about__mvv-title">Our Values</h3>
            <p className="about__mvv-text">Innovation, integrity, intention. Accompany your every shot and be your loyal partner</p>
          </div>
        </div>
      </section>

      <section className="about__team">
        <div className="about__team-inner">
          <div className="about__team-image">
            <img src={about3} alt="Team growing together" />
          </div>
          <div className="about__team-text">
            <h2 className="about__team-heading">An Ever Growing Team</h2>
            <p className="about__team-body">
              As the saying goes, "things come from harmony, and strength comes from unity."
              Impaq Optics has always prioritized the strength of our team and is dedicated to
              building a more skilled and trustworthy workforce. Currently, we have over 100
              well-trained staff across multiple departments, including sales, product development,
              marketing, quality control, and more. In the future, Impaq Optics will continue to
              expand our team to provide you with even better products and services!
            </p>
          </div>
        </div>
      </section>

      <section className="about__brand">
        <h2 className="about__brand-heading">About the Brand</h2>
        <div className="about__brand-chart">
          <img src={about4} alt="Impaq Optics brand chart" />
        </div>
      </section>

    </div>
  )
}