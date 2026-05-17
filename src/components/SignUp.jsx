import React, { useState } from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import "./SignUp.css"

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (password !== confirm) return setError("Passwords do not match.")
    if (password.length < 6) return setError("Password must be at least 6 characters.")
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: firstName + " " + lastName })
      navigate("/")
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)/, ""))
    }
    setLoading(false)
  }

  return (
    <div className="auth__page">
      <div className="auth__card">
        <div className="auth__brand">IMPAQ OPTICS</div>
        <h2 className="auth__title">Create Account</h2>
        <p className="auth__subtitle">Join IMPAQ OPTICS today. It is free.</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__row">
            <div className="auth__field">
              <input className="auth__input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
            </div>
            <div className="auth__field">
              <input className="auth__input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
            </div>
          </div>
          <div className="auth__field">
            <input className="auth__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or phone number" required />
          </div>
          <div className="auth__field">
            <input className="auth__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
          </div>
          <div className="auth__field">
            <input className="auth__input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required />
          </div>
          <p className="auth__terms">
            By clicking Sign Up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
          <button className="auth__btn auth__btn--primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth__divider"><span>or</span></div>

        <div className="auth__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth__link">Log in</Link>
        </div>
      </div>
    </div>
  )
}
