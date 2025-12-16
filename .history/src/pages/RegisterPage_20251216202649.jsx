import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field, value) => {
    if (field === 'name') {
      setName(value)
      if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
    } else if (field === 'email') {
      setEmail(value)
      if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
    } else if (field === 'password') {
      setPassword(value)
      if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value)
      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
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
      await register({ name, email, password })
      navigate('/account')
    } catch (e) {
      setError(e.message || 'Unable to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5 auth-wrapper">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-2 text-center">Create Account</h3>
            <p className="text-muted text-center mb-4">
              Join us to manage your profile
            </p>
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Registration Failed:</strong> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Enter"
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>
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
                  placeholder="name@company.com"
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    placeholder="Minimum 6 characters"
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
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="btn password-toggle-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <hr />
            <p className="mb-0 text-center">
              Already have an account?{' '}
              <Link to="/login" className="link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


