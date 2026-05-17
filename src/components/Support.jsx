import React, { useState } from "react"
import "./Support.css"

const WARRANTY_TABS = ["T-VIP Lifetime Warranty", "5-Year Warranty"]

const WARRANTY_CONTENT = {
  "T-VIP Lifetime Warranty": (
    <div className="warranty-body">
      <p>The "T" stands for Tailored. Impaq Optics products are built to meet your expectation. If your Impaq Optics falls short, we are always here to help you.</p>
      <p>Continental, Tauron, Scrapper, Paragon, and Frenzy line products are covered by our T-VIP lifetime warranty. We will, at our option, either repair or replace your Impaq Optics product without any cost if it is damaged or defective. If we can't repair your damaged product, we will replace it with a brand-new one in better condition.</p>
      <p>You have our word that we will always take care of you and support you. You can count on our T-VIP lifetime warranty.</p>
      <p className="covers-label">T-VIP lifetime warranty covers:</p>
      <ul>
        <li>Fully transferable.</li>
        <li>Free repair or replacement.</li>
        <li>No invoice or receipt is needed.</li>
        <li>We pay the shipping back cost.</li>
        <li>We guarantee a response within 24 hours.</li>
        <li>No questions asked though we value your feedback.</li>
      </ul>
      <p className="exclusion">This warranty does not cover product loss, theft, deliberate damage, abuse, misapplication, or modification.</p>
      <p className="exclusion">This warranty does not apply to the electronic components or batteries.</p>
      <p>If you have more questions, please contact our customer service department via <a href="mailto:service@Impaqoptics.com">service@Impaqoptics.com</a>. If you need to return the product, insure your shipment and keep the tracking records. We are not responsible for your product until we receive it.</p>
      <p>Kindly take a moment to register your new Impaq Optics product to activate your lifetime warranty. This registration provides convenient access to all your product information with just a click.</p>
      <p className="sign-off">We appreciate your understanding and support. <strong>Be Safe and Have Fun!</strong></p>
    </div>
  ),
  "5-Year Warranty": (
    <div className="warranty-body">
      <p>Select Impaq Optics products are covered by our 5-Year warranty. This warranty covers defects in materials and workmanship for five years from the date of original purchase.</p>
      <p>During the warranty period, we will repair or replace, at no charge, products or parts of a product that prove defective due to improper material or workmanship, under normal use and maintenance.</p>
      <p className="covers-label">5-Year warranty covers:</p>
      <ul>
        <li>Manufacturing defects in materials and workmanship.</li>
        <li>Free repair or replacement within warranty period.</li>
        <li>Proof of purchase required.</li>
        <li>We guarantee a response within 24 hours.</li>
      </ul>
      <p className="exclusion">This warranty does not cover product loss, theft, deliberate damage, abuse, misapplication, or modification.</p>
      <p className="exclusion">This warranty does not apply to the electronic components or batteries.</p>
      <p>For warranty service, contact us at <a href="mailto:service@Impaqoptics.com">service@Impaqoptics.com</a> with your proof of purchase and a description of the defect.</p>
      <p className="sign-off">We appreciate your understanding and support. <strong>Be Safe and Have Fun!</strong></p>
    </div>
  ),
}

const CONTACT_CARDS = [
  {
    icon: "✉",
    title: "Email Us",
    detail: "service@Impaqoptics.com",
    sub: "Response within 24 hrs",
    href: "mailto:service@Impaqoptics.com",
  },
  {
    icon: "💬",
    title: "WhatsApp",
    detail: "Chat with us directly",
    sub: "Mon – Sat, 9 AM–6 PM",
    href: "#",
  },
  {
    icon: "📞",
    title: "Call Us",
    detail: "+1 (800) 000-0000",
    sub: "Mon – Fri, 9 AM–5 PM",
    href: "tel:+18000000000",
  },
]

const FAQS = [
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can use it on our carrier's website to see real-time updates." },
  { q: "What is your return policy?", a: "We accept returns within 30 days of purchase for items in original, unused condition. Please contact us at service@Impaqoptics.com to start a return." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5–7 business days. Expedited options (2–3 days) are available at checkout. International orders may take 10–21 days." },
  { q: "Can I change or cancel my order?", a: "Orders can be changed or cancelled within 2 hours of placement. Please contact us immediately at service@Impaqoptics.com." },
  { q: "My item arrived damaged — what do I do?", a: "Take photos of the damage and email them to service@Impaqoptics.com within 48 hours of delivery. We'll arrange a replacement or refund promptly." },
  { q: "Do you offer price matching?", a: "We offer price matching on identical products from authorized US retailers. Contact our support team with the competitor listing and we'll review it." },
]

export default function Support() {
  const [activeTab, setActiveTab] = useState("T-VIP Lifetime Warranty")
  const [openFaq, setOpenFaq] = useState(null)
  const filteredFaqs = FAQS

  return (
    <div className="sp-page">

      {/* ── Hero ── */}
      <section className="sp-hero">
        <div className="sp-hero-bg" />
        <div className="sp-hero-content">
          <span className="sp-badge">● SUPPORT CENTER</span>
          <h1 className="sp-hero-title">
            We're here to <span className="sp-accent">help you</span>
          </h1>
          <p className="sp-hero-sub">
            Find answers fast, or reach out directly — our team typically<br />
            responds within a few hours.
          </p>

        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="sp-contact">
        {CONTACT_CARDS.map((c) => (
          <a key={c.title} href={c.href} className="sp-contact-card">
            <span className="sp-contact-icon">{c.icon}</span>
            <strong>{c.title}</strong>
            <span className="sp-contact-detail">{c.detail}</span>
            <span className="sp-contact-sub">{c.sub}</span>
          </a>
        ))}
      </section>

      {/* ── Warranty ── */}
      <section className="sp-warranty-section">
        <div className="sp-section-label">WARRANTY</div>
        <h2 className="sp-section-title">Warranty Policy</h2>
        <p className="sp-section-sub">
          We tailor warranty policies for each of our products to ensure our customers receive the best after-sales experience.
        </p>

        <div className="sp-tabs">
          {WARRANTY_TABS.map((tab) => (
            <button
              key={tab}
              className={"sp-tab" + (activeTab === tab ? " sp-tab--active" : "")}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="sp-panel">
          {WARRANTY_CONTENT[activeTab]}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sp-faq-section">
        <div className="sp-section-label">COMMON QUESTIONS</div>
        <h2 className="sp-section-title">Frequently asked</h2>

        <div className="sp-faq-list">
          {filteredFaqs.map((f, i) => (
            <div
              key={i}
              className={"sp-faq-item" + (openFaq === i ? " sp-faq-item--open" : "")}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="sp-faq-q">
                <span>{f.q}</span>
                <span className="sp-faq-chevron">{openFaq === i ? "▲" : "▼"}</span>
              </div>
              {openFaq === i && <div className="sp-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}