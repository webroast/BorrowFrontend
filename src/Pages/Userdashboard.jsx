import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { LayoutDashboard, UserPen, Save, CheckCircle2 } from 'lucide-react'

const Userdashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Tab Management ('overview' | 'editProfile') ──
  const [activeTab, setActiveTab] = useState('overview')

  // ── Pull the logged-in user + their local activity (cart/wishlist) ──
  const [userInfo, setUserInfo] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // ── Edit Profile Form State ──
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

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

  useEffect(() => {
    // Check if routed directly with ?tab=profile
    const searchParams = new URLSearchParams(location.search)
    const requestedTab = searchParams.get('tab')
    if (requestedTab === 'profile' || requestedTab === 'editprofile') {
      setActiveTab('editProfile')
    }

    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUserInfo(parsed)

        const rawUser = parsed.user || parsed
        setEditFormData({
          name: getFullName(parsed),
          email: rawUser.email || '',
          phone: rawUser.phone || rawUser.mobile || '',
          houseNo: rawUser.houseNo || '',
          street: rawUser.street || '',
          landmark: rawUser.landmark || '',
          city: rawUser.city || '',
          state: rawUser.state || '',
          pincode: rawUser.pincode || ''
        })
      } catch (err) {
        console.error('Error parsing stored user:', err)
      }
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartCount(cart.length)

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    setWishlistCount(wishlist.length)
  }, [location.search])

  // Handle Edit Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit Profile Changes
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setSaveSuccessMsg('')

    const currentUserId = userInfo?.user?.id ?? userInfo?.id

    try {
      // Optional: Call Spring Boot Backend User update endpoint if present
      if (currentUserId) {
        try {
          await axios.put(`http://localhost:8080/api/user/update/${currentUserId}`, editFormData)
        } catch (apiErr) {
          console.warn('Backend user endpoint skipped or not yet configured:', apiErr.message)
        }
      }

      // Merge and update local storage user
      const updatedUser = {
        ...(userInfo || {}),
        ...editFormData,
        fullName: editFormData.name,
        name: editFormData.name
      }

      if (userInfo?.user) {
        updatedUser.user = {
          ...userInfo.user,
          ...editFormData,
          fullName: editFormData.name,
          name: editFormData.name
        }
      }

      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUserInfo(updatedUser)
      setSaveSuccessMsg('Profile details updated successfully!')
      setTimeout(() => setSaveSuccessMsg(''), 4000)
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Could not update profile. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  const displayName = getFullName(userInfo)
  const displayEmail = userInfo?.user?.email || userInfo?.email || 'Not available'
  const displayId = userInfo?.user?.id ?? userInfo?.id ?? 'Not available'
  const displayRole = userInfo?.user?.role || userInfo?.role || 'ROLE_USER'

  return (
    <>
      <style>
        {`
        .contact-hero-wrapper {
          position: relative;
          width: 100%;
          height: 50vh;
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
          font-size: 2.8rem;
          font-weight: 200;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .contact-hero-content p {
          font-family: monospace;
          font-size: 1.1rem;
          margin-top: 10px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
        }

        /* ── Dashboard content ── */
        .dash-section {
          background-color: #f8f9fa;
          padding: 50px 0 80px 0;
        }

        /* ── Navigation Tabs ── */
        .dash-tab-container {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .dash-tab-btn {
          border: none;
          background: transparent;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 0.95rem;
          color: #64748b;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dash-tab-btn:hover {
          color: #0d6efd;
          background-color: #f1f5f9;
        }

        .dash-tab-btn.active {
          color: #0d6efd;
          background-color: #e0edff;
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
        `}
      </style>

      {/* Top White Bar + Navbar with Logout Capsule */}
      <Header hideHero={true} isLoggedIn={true} onLogout={handleLogout} />

      {/* Hero Header Section */}
      <div className="contact-hero-wrapper">
        <img
          src="https://images.unsplash.com/photo-1640969178204-261969c1305c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Dashboard Background"
          className="contact-hero-image"
        />
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Welcome, {displayName}</h1>
          <p>
            {activeTab === 'overview'
              ? 'Here is a quick snapshot of your account and rental activity.'
              : 'Manage your personal information and default shipping details.'}
          </p>
        </div>
      </div>

      {/* ── Dashboard Body ── */}
      <div className="dash-section">
        <div className="container">
          {/* Interactive Navigation Tabs */}
          <div className="dash-tab-container">
            <button
              className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            <button
              className={`dash-tab-btn ${activeTab === 'editProfile' ? 'active' : ''}`}
              onClick={() => setActiveTab('editProfile')}
            >
              <UserPen size={18} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
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
                    <div>
                      <div className="dash-info-label">Contact</div>
                      <div className="dash-info-value">{editFormData.phone || 'Not Provided'}</div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1"
                    onClick={() => setActiveTab('editProfile')}
                  >
                    <UserPen size={16} /> Edit Info
                  </button>
                  <button className="dash-logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
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

                <Link to="/myorders" className="dash-activity-card">
                  <div className="dash-activity-icon">
                    <i className="fa-solid fa-box"></i>
                  </div>
                  <div className="dash-activity-count">—</div>
                  <div className="dash-activity-label">My Orders</div>
                </Link>

                <Link to="/" className="dash-activity-card">
                  <div className="dash-activity-icon">
                    <i className="fa-solid fa-house"></i>
                  </div>
                  <div className="dash-activity-count">—</div>
                  <div className="dash-activity-label">Browse Categories</div>
                </Link>
              </div>
            </>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'editProfile' && (
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                  <h4 className="fw-bold mb-1">Edit Profile Details</h4>
                  <p className="text-muted small mb-0">
                    Update your account details and default delivery address for faster checkout.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                  onClick={() => setActiveTab('overview')}
                >
                  Cancel
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4" role="alert">
                  <CheckCircle2 size={18} />
                  <div>{saveSuccessMsg}</div>
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                {/* 1. Basic Account Information */}
                <h6 className="fw-bold text-primary mb-3">1. Personal Information</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editFormData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Contact Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="e.g. +91 9876543210"
                      value={editFormData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* 2. Default Shipping Address */}
                <h6 className="fw-bold text-primary mb-3">2. Default Delivery Address</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Flat / House No. / Building</label>
                    <input
                      type="text"
                      name="houseNo"
                      className="form-control"
                      placeholder="e.g. Flat 402, Building A"
                      value={editFormData.houseNo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      className="form-control"
                      placeholder="e.g. Near City Hospital"
                      value={editFormData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Street Address / Area</label>
                    <input
                      type="text"
                      name="street"
                      className="form-control"
                      placeholder="e.g. SV Road, Silver Oaks Layout"
                      value={editFormData.street}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="e.g. Mumbai"
                      value={editFormData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      placeholder="e.g. Maharashtra"
                      value={editFormData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      placeholder="e.g. 400053"
                      value={editFormData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setActiveTab('overview')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2"
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <hr className="m-0" />
      <Footer />
    </>
  )
}

export default Userdashboard