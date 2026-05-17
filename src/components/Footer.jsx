import React from 'react'
import './Footer.css'

const FOOTER_LINKS = [
  {
    heading: 'About Us',
    links: ['Our History', 'Why Impaq', 'ICON'],
  },
  {
    heading: 'Product',
    links: ['Rifles Scopes', 'Red Dot Sight'],
  },
  {
    heading: 'Support',
    links: ['Warranty', 'OEM/ODM/OBM', 'FAQS', 'Download', 'Video'],
  },
  {
    heading: 'Contact Us',
    links: [],
  },
  {
    heading: 'Community',
    links: ['Blogs', 'Brand', 'Ambassador', 'Program', 'Affiliate Program', 'Gallery'],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        <div className="footer__brand">
          <p className="footer__logo">IMPAQ OPTICS</p>
          <p className="footer__follow">Follow Us</p>
          <div className="footer__socials">

            <a href="#" className="footer__social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

            <a href="#" className="footer__social-link footer__social-link--yt" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1e1e1e"/>
              </svg>
            </a>

            <a href="#" className="footer__social-link footer__social-link--ig" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            <a href="#" className="footer__social-link" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
            </a>

          </div>
        </div>

        <div className="footer__nav">
          {FOOTER_LINKS.map((col) => (
            <div className="footer__col" key={col.heading}>
              <p className="footer__col-heading">{col.heading}</p>
              <ul className="footer__col-list">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__col-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <div className="footer__bottom">
        <p className="footer__copy">© {new Date().getFullYear()} IMPAQ OPTICS. All rights reserved.</p>
      </div>

    </footer>
  )
}