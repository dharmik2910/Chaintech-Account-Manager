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
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetStep, setResetStep] = useState('email') // 'email' or 'password'

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Enter your correct password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field, value) => {
    if (field === 'email') {
      setEmail(value)
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: '' }))
      }
    } else if (field === 'password') {
      setPassword(value)
      if (errors.password) {
        setErrors(prev => ({ ...prev, password: '' }))
      }
    }
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validateForm()) {
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleForgotPasswordEmail = () => {
    setResetError('')
    setResetMessage('')

    if (!resetEmail.trim()) {
      setResetError('Email is required')
      return
    }

    if (!validateEmail(resetEmail)) {
      setResetError('Please enter a valid email address')
      return
    }

    // Check if email exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userExists = users.find(u => u.email === resetEmail)

    if (!userExists) {
      setResetError('No account found with this email address')
      return
    }

    // Move to password reset step
    setResetStep('password')
    setResetMessage('Enter your new password')
  }

  const handleResetPassword = () => {
    setResetError('')
    setResetMessage('')

    if (!newPassword.trim()) {
      setResetError('Password is required')
      return
    }

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters')
      return
    }

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u => 
      u.email === resetEmail ? { ...u, password: newPassword } : u
    )

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setResetMessage('Password reset successfully! You can now login.')
    setResetStep('email')
    setResetEmail('')
    setNewPassword('')

    // Close modal after success
    setTimeout(() => {
      setShowForgotPassword(false)
      setResetMessage('')
    }, 2000)
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false)
    setResetEmail('')
    setNewPassword('')
    setResetMessage('')
    setResetError('')
    setResetStep('email')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4 auth-wrapper">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-2 text-center">Sign In</h3>
            <p className="text-muted text-center mb-4">Access your account</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Login Failed:</strong> {error}
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
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="Enter Your Email Address"
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setShowForgotPassword(true)}
                  style={{ fontSize: '0.85rem' }}
                >
                  Forgot Password?
                </button>
              </div>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    placeholder="Enter Your Password"
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
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <hr />
            <p className="mb-0 text-center">
              New to Account Manager?{' '}
              <Link to="/register" className="link-primary">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


