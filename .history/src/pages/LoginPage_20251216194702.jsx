import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    try {
      setIsSubmitting(true)
      await login({ email, password })
      navigate('/account')
    } catch (e) {
      setError(e.message || 'Unable to log in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4 auth-wrapper">
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-4">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔓</div>
              <h3 className="card-title">Welcome Back</h3>
              <p className="text-muted">Log in to your account</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  🔑 Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <hr />

            <p className="text-center mb-0">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="link-primary">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


