import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../Component/Header'
import Footer from '../Component/Footer'

const Userdashboard = () => {
  const navigate = useNavigate()

  // ── Pull the logged-in user + their local activity (cart/wishlist) ──
  const [userInfo, setUserInfo] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored))
      } catch (err) {
        console.error('Error parsing stored user:', err)
      }
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartCount(cart.length)

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    setWishlistCount(wishlist.length)
  }, [])

  // Logout handler clears stored user session and redirects to Login
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  // Helper to extract full name from combined or split name keys
  const getFullName = (data) => {
    if (!data) return 'User'
    const target = data.user || data

    if (target.fullName || target.fullname) return target.fullName || target.fullname
    if (target.name) return target.name
    if (target.firstName || target.firstname) {
      const first = target.firstName || target.firstname || ''
      const last = target.lastName || target.lastname || ''
      const combined = `${first} ${last}`.trim()
      if (combined) return combined
    }
    if (target.username || target.userName) return target.username || target.userName
    return 'User'
  }

  const displayName = getFullName(userInfo)
  const displayEmail =
    userInfo?.user?.email || userInfo?.email || 'Not available'
  const displayId = userInfo?.user?.id ?? userInfo?.id ?? 'Not available'
  const displayRole = userInfo?.user?.role || userInfo?.role || 'ROLE_USER'

  return (
    <>
      <style>
        {`
        .contact-hero-wrapper {
          position: relative;
          width: 100%;
          height: 55vh;
          overflow: hidden;
          background-color: #0f172a;
        }

        .contact-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        .contact-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.50);
          z-index: 1;
        }

        .contact-hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffffff;
          padding: 0 20px;
        }

        .contact-hero-content h1 {
          font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
          font-size: 3rem;
          font-weight: 200;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .contact-hero-content p {
          font-family: monospace;
          font-size: 1.2rem;
          margin-top: 15px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
        }

        .contact-info-section {
          background-color: #0f172a;
          padding: 80px 0;
        }

        /* ── Dashboard content ── */
        .dash-section {
          background-color: #f8f9fa;
          padding: 60px 0 80px 0;
        }

        .dash-profile-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 30px;
        }

        .dash-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 700;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .dash-info-row {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .dash-info-label {
          color: #6c757d;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .dash-info-value {
          color: #212529;
          font-weight: 600;
          font-size: 0.98rem;
        }

        .dash-activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .dash-activity-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          text-align: center;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .dash-activity-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(13, 110, 253, 0.12);
        }

        .dash-activity-icon {
          font-size: 1.8rem;
          color: #0d6efd;
          margin-bottom: 10px;
        }

        .dash-activity-count {
          font-size: 1.6rem;
          font-weight: 800;
          color: #212529;
        }

        .dash-activity-label {
          color: #6c757d;
          font-size: 0.9rem;
          margin-top: 4px;
        }

        /* ── Outline Danger Logout Button ── */
        .dash-logout-btn {
          background-color: transparent;
          color: #dc3545;
          border: 2px solid #dc3545;
          border-radius: 50px;
          padding: 8px 24px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.25s ease-in-out;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .dash-logout-btn:hover {
          background-color: #dc3545;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);
          transform: translateY(-1px);
        }

        .dash-logout-btn:active {
          transform: translateY(0);
          background-color: #bb2d3b;
          border-color: #bb2d3b;
        }
        `}
      </style>

      {/* Top White Bar + Navbar with Logout Capsule */}
      <Header hideHero={true} isLoggedIn={true} onLogout={handleLogout} />

      {/* Hero Header Section with Background Image */}
      <div className="contact-hero-wrapper">
        <img
          src="https://images.unsplash.com/photo-1640969178204-261969c1305c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Dashboard Background"
          className="contact-hero-image"
        />
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Welcome, {displayName}</h1>
          <p>Here is a quick snapshot of your account and rental activity.</p>
        </div>
      </div>

      {/* ── Dashboard Body ── */}
      <div className="dash-section">
        <div className="container">
          {/* Account Info Card */}
          <div className="dash-profile-card flex-wrap">
            <div className="dash-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-1">{displayName}</h4>
              <span className="badge bg-primary-subtle text-primary fw-semibold">
                {String(displayRole).replace('ROLE_', '')}
              </span>

              <div className="dash-info-row">
                <div>
                  <div className="dash-info-label">User ID</div>
                  <div className="dash-info-value">{displayId}</div>
                </div>
                <div>
                  <div className="dash-info-label">Email</div>
                  <div className="dash-info-value">{displayEmail}</div>
                </div>
              </div>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Activity Summary */}
          <h5 className="fw-bold mb-3">Your Activity</h5>
          <div className="dash-activity-grid">
            <Link to="/cart" className="dash-activity-card">
              <div className="dash-activity-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <div className="dash-activity-count">{cartCount}</div>
              <div className="dash-activity-label">Items in Cart</div>
            </Link>

            <Link to="/wishlist" className="dash-activity-card">
              <div className="dash-activity-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="dash-activity-count">{wishlistCount}</div>
              <div className="dash-activity-label">Wishlist Items</div>
            </Link>

            <Link to="/" className="dash-activity-card">
              <div className="dash-activity-icon">
                <i className="fa-solid fa-house"></i>
              </div>
              <div className="dash-activity-count">—</div>
              <div className="dash-activity-label">Browse Categories</div>
            </Link>
          </div>
        </div>
      </div>
      <hr className="m-0" />
      <Footer />
    </>
  )
}

export default Userdashboard