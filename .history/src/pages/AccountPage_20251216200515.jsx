import { useState } from 'react'
import { useAuth } from '../AuthContext.jsx'

function AccountPage() {
  const { currentUser, updateProfile } = useAuth()
  const [name, setName] = useState(currentUser?.name ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!name || !email) {
      setError('Name and email are required.')
      return
    }

    try {
      setIsSaving(true)
      await updateProfile({ name, email, password: password.trim() })
      setMessage('Your account has been updated successfully.')
      setPassword('')
    } catch (e) {
      setError(e.message || 'Unable to update account.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentUser) {
    return <p className="text-center text-muted mt-5">You must be logged in to view this page.</p>
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6 account-wrapper">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-2">Account Settings</h3>
            <p className="text-muted mb-4">
              Manage your profile information
            </p>

            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
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
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  New Password (optional)
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
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

              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


