import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

const ADMIN_EMAIL = "mandymacatula258@gmail.com"

const NAV_LINKS = [
  { label: "Home",       to: "/"        },
  { label: "Support",    to: "support" },
  { label: "Product",    to: "/product" },
  { label: "Shop",       to: "/shop"    },
  { label: "About Us",   to: "/about"   },
  { label: "Contact Us", to: "/contact" },
]

function NavbarAuth() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const isAdmin = currentUser?.email === ADMIN_EMAIL

  async function handleLogout() {
    await signOut(auth)
    setDropdownOpen(false)
    navigate("/")
  }

  if (currentUser) {
    const firstName = currentUser.displayName ? currentUser.displayName.split(" ")[0] : currentUser.email
    return (
      <div className="navbar__user-wrap">
        <button className="navbar__user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="navbar__avatar">{firstName.charAt(0).toUpperCase()}</div>
          <span className="navbar__welcome">Welcome, {firstName}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {dropdownOpen && (
          <div className="navbar__dropdown">
            <p className="navbar__dropdown-email">{currentUser.email}</p>
            {isAdmin && (
              <Link to="/admin" className="navbar__dropdown-admin" onClick={() => setDropdownOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            <button className="navbar__dropdown-logout" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="navbar__auth-btns">
      <Link to="/login" className="navbar__login">Log in</Link>
      <Link to="/signup" className="navbar__signup">Sign up</Link>
    </div>
  )
}

function NavbarAuthMobile({ onClose }) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const isAdmin = currentUser?.email === ADMIN_EMAIL

  async function handleLogout() {
    await signOut(auth)
    onClose()
    navigate("/")
  }

  if (currentUser) {
    const firstName = currentUser.displayName ? currentUser.displayName.split(" ")[0] : currentUser.email
    return (
      <>
        <li><span className="navbar__mobile-email">Welcome, {firstName}</span></li>
        {isAdmin && (
          <li>
            <Link to="/admin" className="navbar__mobile-link" onClick={onClose}>
              Admin Dashboard
            </Link>
          </li>
        )}
        <li><button className="navbar__mobile-logout" onClick={handleLogout}>Log Out</button></li>
      </>
    )
  }

  return (
    <>
      <li><Link to="/login" className="navbar__mobile-link" onClick={onClose}>Log in</Link></li>
      <li><Link to="/signup" className="navbar__mobile-signup" onClick={onClose}>Sign up</Link></li>
    </>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/"
    return location.pathname === to
  }

  const renderLink = ({ label, to }) => {
    const isPage = to.startsWith("/")
    if (isPage) {
      return (
        <Link to={to} className={"navbar__link" + (isActive(to) ? " navbar__link--active" : "")} onClick={() => setMenuOpen(false)}>
          {label}<span className="navbar__link-underline" />
        </Link>
      )
    }
    return (
      <a href={to} className="navbar__link" onClick={() => setMenuOpen(false)}>
        {label}<span className="navbar__link-underline" />
      </a>
    )
  }

  const renderMobileLink = ({ label, to }) => {
    const isPage = to.startsWith("/")
    if (isPage) {
      return (
        <Link to={to} className={"navbar__mobile-link" + (isActive(to) ? " navbar__mobile-link--active" : "")} onClick={() => setMenuOpen(false)}>
          {label}
        </Link>
      )
    }
    return (
      <a href={to} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>{label}</a>
    )
  }

  return (
    <header className={"navbar" + (scrolled ? " navbar--scrolled" : "")}>
      <nav className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="IMPAQ OPTICS Home">IMPAQ OPTICS</Link>
        <ul className="navbar__links" role="menubar">
          {NAV_LINKS.map((link) => (
            <li key={link.label} role="none">{renderLink(link)}</li>
          ))}
          <li role="none"><NavbarAuth /></li>
        </ul>
        <button
          className={"navbar__hamburger" + (menuOpen ? " navbar__hamburger--open" : "")}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
        </button>
      </nav>
      <div className={"navbar__mobile-menu" + (menuOpen ? " navbar__mobile-menu--open" : "")}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>{renderMobileLink(link)}</li>
          ))}
          <NavbarAuthMobile onClose={() => setMenuOpen(false)} />
        </ul>
      </div>
    </header>
  )
}