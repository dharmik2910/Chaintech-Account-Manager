import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

function AccountPage() {
  const { currentUser, updateProfile, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [editingField, setEditingField] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordView, setShowPasswordView] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' }
    
    let strength = 0
    
    // Length check
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (pwd.length >= 14) strength++
    
    // Uppercase check
    if (/[A-Z]/.test(pwd)) strength++
    
    // Lowercase check
    if (/[a-z]/.test(pwd)) strength++
    
    // Number check
    if (/[0-9]/.test(pwd)) strength++
    
    // Special character check
    if (/[!@#$%^&*()_+=\-{};':"\\|,.<>/?]/.test(pwd)) strength++
    
    if (strength <= 2) {
      return { level: 1, text: 'Weak', color: '#ef4444' }
    } else if (strength <= 4) {
      return { level: 2, text: 'Medium', color: '#f59e0b' }
    } else {
      return { level: 3, text: 'Strong', color: '#22c55e' }
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleEditClick = (field) => {
    setEditingField(field)
    setError('')
    setMessage('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      password: ''
    })
    setShowPassword(false)
    setShowPasswordView(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (field) => {
    setError('')
    setMessage('')

    if (field === 'name' && !formData.name.trim()) {
      setError('Name cannot be empty.')
      return
    }

    if (field === 'email' && !formData.email.trim()) {
      setError('Email cannot be empty.')
      return
    }

    try {
      setIsSaving(true)
      const updateData = {}
      
      if (field === 'name') {
        updateData.name = formData.name
        updateData.email = currentUser.email
      } else if (field === 'email') {
        updateData.name = currentUser.name
        updateData.email = formData.email
      } else if (field === 'password') {
        if (!formData.password.trim()) {
          setError('Password cannot be empty.')
          setIsSaving(false)
          return
        }
        updateData.name = currentUser.name
        updateData.email = currentUser.email
        updateData.password = formData.password
      }

      await updateProfile(updateData)
      setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`)
      setEditingField(null)
      setFormData({
        name: currentUser?.name ?? '',
        email: currentUser?.email ?? '',
        password: ''
      })
      setShowPassword(false)
    } catch (e) {
      setError(e.message || `Unable to update ${field}.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true)
      deleteAccount()
      setShowDeleteConfirm(false)
      navigate('/login')
    } catch (e) {
      setError(e.message || 'Unable to delete account.')
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
            <h3 className="card-title mb-2">
              Welcome Back, <span style={{ color: '#3b82f6' }}>{currentUser.name}</span>
            </h3>
            <p className="text-muted mb-5">
              Manage your personal information below
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

            {/* Name Field */}
            <div className="account-field mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="text-muted small mb-2">Name</p>
                  {editingField === 'name' ? (
                    <div className="mb-3">
                      <input
                        type="text"
                        name="name"
                        className="form-control mb-2"
                        value={formData.name}
                        onChange={handleChange}
                        autoFocus
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSave('name')}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-0">{currentUser.name}</p>
                  )}
                </div>
                {editingField !== 'name' && (
                  <button
                    className="btn btn-link link-primary p-0"
                    onClick={() => handleEditClick('name')}
                  >
                    Edit
                  </button>
                )}
              </div>
              <hr className="my-3" />
            </div>

            {/* Email Field */}
            <div className="account-field mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="text-muted small mb-2">Email</p>
                  {editingField === 'email' ? (
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control mb-2"
                        value={formData.email}
                        onChange={handleChange}
                        autoFocus
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSave('email')}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-0">{currentUser.email}</p>
                  )}
                </div>
                {editingField !== 'email' && (
                  <button
                    className="btn btn-link link-primary p-0"
                    onClick={() => handleEditClick('email')}
                  >
                    Edit
                  </button>
                )}
              </div>
              <hr className="my-3" />
            </div>

            {/* Password Field */}
            <div className="account-field mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="text-muted small mb-2">Password</p>
                  {editingField === 'password' ? (
                    <div className="mb-3">
                      <div className="input-group mb-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          autoFocus
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
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSave('password')}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <p className="mb-0">
                        {showPasswordView ? currentUser.password : '•'.repeat(currentUser.password?.length || 0)}
                      </p>
                      <button
                        className="btn btn-sm p-1"
                        onClick={() => setShowPasswordView(!showPasswordView)}
                        aria-label={showPasswordView ? 'Hide password' : 'Show password'}
                        title={showPasswordView ? 'Hide password' : 'Show password'}
                      >
                        <i className={showPasswordView ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                      </button>
                    </div>
                  )}
                </div>
                {editingField !== 'password' && (
                  <button
                    className="btn btn-link link-primary p-0"
                    onClick={() => handleEditClick('password')}
                  >
                    Edit
                  </button>
                )}
              </div>
              <hr className="my-3" />
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 gap-sm-0 d-sm-flex">
              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Log Out
              </button>
              <button
                className="btn btn-outline-secondary ms-sm-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Delete Account</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSaving}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p className="text-danger fw-bold mb-3">⚠️ Warning: This action cannot be undone!</p>
                      <p>Are you sure you want to permanently delete your account? All your data will be removed.</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDeleteAccount}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Deleting...' : 'Yes, Delete My Account'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


