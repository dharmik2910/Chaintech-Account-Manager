import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import './App.css'

// Simple layout with a top navbar
function Layout({ children }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-root">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🔐 Account Manager
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              {currentUser ? (
                <>
                  <li className="nav-item me-lg-2">
                    <span className="navbar-text">👤 {currentUser.name}</span>
                  </li>
                  <li className="nav-item mt-2 mt-lg-0">
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-light btn-sm ms-lg-2 mt-2 mt-lg-0" to="/register">
                      Get Started
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

// Protect routes that require authentication
function PrivateRoute({ children }) {
  const { currentUser, initialised } = useAuth()

  if (!initialised) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/account" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
