import React, { useState } from 'react'
import './FeaturedSeries.css'

import img7 from '../assets/7.png'
import img8 from '../assets/8.png'
import img9 from '../assets/9.png'
import img10 from '../assets/10.png'
import img11 from '../assets/11.png'
import img12 from '../assets/12.png'

const FEATURED = [
  { id: 1, image: img7,  title: 'Continental PRS', description: 'Fast precision and reliable tracking for every stage.' },
  { id: 2, image: img8,  title: 'Continental Benchrest Shooting', description: 'Stable, repeatable accuracy for the smallest groups.' },
  { id: 3, image: img9,  title: 'Continental Field Target Shooting', description: 'Precision-built optics for the demanding world of Field Target shooting.' },
  { id: 4, image: img10, title: 'Continental Long Range', description: 'Engineered for extreme distances with unmatched clarity.' },
  { id: 5, image: img11, title: 'Continental Hunting Series', description: 'Built for the field, trusted by hunters worldwide.' },
  { id: 6, image: img12, title: 'Continental Elite', description: 'The pinnacle of optical engineering for elite shooters.' },
]

const CARDS_PER_VIEW = 3

export default function FeaturedSeries() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = FEATURED.length - CARDS_PER_VIEW

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0))
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))

  const visibleCards = FEATURED.slice(currentIndex, currentIndex + CARDS_PER_VIEW)

  return (
    <section className="featured" id="featured">

      <div className="featured__header">
        <div className="featured__header-text">
          <p className="featured__tagline">High-End Series Recommendation</p>
          <h2 className="featured__title">
            Precision-crafted for superior optical quality
          </h2>
        </div>

        <div className="featured__nav">
          <button
            className={currentIndex === 0 ? 'featured__nav-btn featured__nav-btn--disabled' : 'featured__nav-btn'}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={currentIndex === maxIndex ? 'featured__nav-btn featured__nav-btn--disabled' : 'featured__nav-btn'}
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="featured__grid">
        {visibleCards.map((item) => (
          <div className="featured__card" key={item.id}>
            <div className="featured__card-img-wrap">
              <img
                src={item.image}
                alt={item.title}
                className="featured__card-img"
                draggable={false}
              />
              <div className="featured__card-overlay" />
            </div>
            <div className="featured__card-body">
              <h3 className="featured__card-title">{item.title}</h3>
              <p className="featured__card-desc">{item.description}</p>

            </div>
          </div>
        ))}
      </div>

      <div className="featured__dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={i === currentIndex ? 'featured__dot featured__dot--active' : 'featured__dot'}
            onClick={() => setCurrentIndex(i)}
            aria-label={'Slide ' + (i + 1)}
          />
        ))}
      </div>

    </section>
  )
}