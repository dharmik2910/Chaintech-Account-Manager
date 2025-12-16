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
            <h3 className="card-title text-center">Sign In</h3>
            <p className="text-muted text-center mb-4">Access your account</p>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            <hr />
            
            <p className="mb-0 text-center text-muted">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="link-primary">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


