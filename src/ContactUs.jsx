import React from "react"
import "./ContactUs.css"
import contactImg from "../assets/contact.png"

const DEPARTMENTS = [
  {
    id: 1,
    title: "Dealer Partnership",
    phone: "+1 (000) 000-0000",
    email: "dealer@impaqoptics.com",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    id: 2,
    title: "Pre-sales Consultation",
    phone: "+1 (000) 000-0000",
    email: "presales@impaqoptics.com",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4l3 3",
  },
  {
    id: 3,
    title: "After-sales Service",
    phone: "+1 (000) 000-0000",
    email: "aftersales@impaqoptics.com",
    icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.33 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2z",
  },
  {
    id: 4,
    title: "Brand Partnership and Sponsorship",
    phone: "+1 (000) 000-0000",
    email: "brand@impaqoptics.com",
    icon: "M2 3h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zM8 21h8M12 17v4",
  },
  {
    id: 5,
    title: "Order Shipping and Logistics",
    phone: "+1 (000) 000-0000",
    email: "logistics@impaqoptics.com",
    icon: "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M9 11h14v10H9zM16 11v-2a2 2 0 0 0-2-2",
  },
  {
    id: 6,
    title: "Product & Service Complaint",
    phone: "+1 (000) 000-0000",
    email: "support@impaqoptics.com",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01",
  },
]

export default function ContactUs() {
  return (
    <div className="contact">
      <section
        className="contact__hero"
        style={{ backgroundImage: "url(" + contactImg + ")" }}
      >
        <div className="contact__hero-overlay" />
        <div className="contact__hero-content">
          <h1 className="contact__hero-title">Contact Us</h1>
        </div>
      </section>

      <section className="contact__body">
        <div className="contact__body-inner">
          <p className="contact__intro">
            Reach out to the right team and we will get back to you as soon as possible.
          </p>
          <div className="contact__grid">
            {DEPARTMENTS.map((dept) => (
              <div className="contact__card" key={dept.id}>
                <div className="contact__card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={dept.icon} />
                  </svg>
                </div>
                <div className="contact__card-info">
                  <h3 className="contact__card-title">{dept.title}</h3>
                  <p className="contact__card-detail">
                    <span className="contact__card-label">Phone: </span>{dept.phone}
                  </p>
                  <p className="contact__card-detail">
                    <span className="contact__card-label">Email: </span>{dept.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}