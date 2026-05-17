import React, { useState } from "react"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess(true)
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      setError("Wrong email or password. Please try again.")
    }
    setLoading(false)
  }

  if (currentUser && !success) {
    const firstName = currentUser.displayName ? currentUser.displayName.split(" ")[0] : "back"
    return (
      <div className="auth__page">
        <div className="auth__card">
          <div className="auth__brand">IMPAQ OPTICS</div>
          <div className="auth__success-icon">?</div>
          <h2 className="auth__title">Welcome back, {firstName}!</h2>
          <p className="auth__subtitle">You are already logged in to your account.</p>
          <button className="auth__btn auth__btn--primary" onClick={() => navigate("/")}>Go to Home</button>
          <Link to="#" className="auth__link auth__link--center" onClick={async () => { const { signOut } = await import("firebase/auth"); await signOut(auth) }}>
            Log out instead
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    const firstName = currentUser?.displayName ? currentUser.displayName.split(" ")[0] : "back"
    return (
      <div className="auth__page">
        <div className="auth__card">
          <div className="auth__brand">IMPAQ OPTICS</div>
          <div className="auth__success-icon">?</div>
          <h2 className="auth__title">Welcome back, {firstName}!</h2>
          <p className="auth__subtitle">Login successful. Redirecting you to the home page...</p>
          <div className="auth__progress">
            <div className="auth__progress-bar" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth__page">
      <div className="auth__card">
        <div className="auth__brand">IMPAQ OPTICS</div>
        <h2 className="auth__title">Log In</h2>
        <p className="auth__subtitle">Welcome back. Sign in to your account.</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <input className="auth__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or phone number" required />
          </div>
          <div className="auth__field">
            <input className="auth__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          </div>
          <button className="auth__btn auth__btn--primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="auth__divider"><span>or</span></div>

        <div className="auth__footer">
          Do not have an account?{" "}
          <Link to="/signup" className="auth__link">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
