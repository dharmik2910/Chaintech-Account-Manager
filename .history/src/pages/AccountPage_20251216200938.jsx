import { useState } from 'react'
import { useAuth } from '../AuthContext.jsx'

function AccountPage() {
  const { currentUser, updateProfile } = useAuth()
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (field) => {
    setError('')
    setMessage('')

    const updateData = {
      name: formData.name,
      email: formData.email,
      password: field === 'password' ? formData.password.trim() : '',
    }

    if (!updateData.name || !updateData.email) {
      setError('Name and email are required.')
      return
    }

    try {
      setIsSaving(true)
      await updateProfile(updateData)
      setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`)
      if (field === 'password') {
        setFormData((prev) => ({ ...prev, password: '' }))
      }
      setEditingField(null)
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
      <div className="col-md-8 col-lg-7 account-wrapper">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-1">Welcome Back, <span style={{ color: '#667eea' }}>{currentUser.name}</span></h3>
            <p className="text-muted mb-4">Manage your personal information below</p>

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

            {/* Name Field */}
            <div className="profile-field mb-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <label className="form-label mb-0">Name</label>
                {editingField !== 'name' && (
                  <button
                    className="btn btn-link btn-sm"
                    onClick={() => setEditingField('name')}
                    style={{ color: '#667eea', textDecoration: 'none' }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'name' ? (
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSave('name')}
                    disabled={isSaving}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditingField(null)
                      setFormData((prev) => ({ ...prev, name: currentUser.name }))
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="mb-0 text-dark fw-500">{formData.name}</p>
              )}
            </div>

            <hr />

            {/* Email Field */}
            <div className="profile-field mb-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <label className="form-label mb-0">Email</label>
                {editingField !== 'email' && (
                  <button
                    className="btn btn-link btn-sm"
                    onClick={() => setEditingField('email')}
                    style={{ color: '#667eea', textDecoration: 'none' }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'email' ? (
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSave('email')}
                    disabled={isSaving}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditingField(null)
                      setFormData((prev) => ({ ...prev, email: currentUser.email }))
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="mb-0 text-dark fw-500">{formData.email}</p>
              )}
            </div>

            <hr />

            {/* Password Field */}
            <div className="profile-field mb-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <label className="form-label mb-0">Password</label>
                {editingField !== 'password' && (
                  <button
                    className="btn btn-link btn-sm"
                    onClick={() => setEditingField('password')}
                    style={{ color: '#667eea', textDecoration: 'none' }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingField === 'password' ? (
                <div className="input-group mb-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    placeholder="Enter new password"
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
              ) : (
                <p className="mb-0">•••••••••</p>
              )}
              {editingField === 'password' && (
                <div className="mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSave('password')}
                    disabled={isSaving || !formData.password}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => {
                      setEditingField(null)
                      setFormData((prev) => ({ ...prev, password: '' }))
                      setShowPassword(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <hr />

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <button className="btn btn-danger">Log Out</button>
              <button className="btn btn-outline-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


