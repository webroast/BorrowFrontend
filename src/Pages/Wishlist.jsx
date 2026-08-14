import React, { useState } from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { Link } from 'react-router-dom'
import wishimg from '../Images/Wishlistimg.png'

const Wishlist = ({ wishlist = [], toggleWishlist, isLoggedIn }) => {
  const [borrowItem, setBorrowItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [borrowDate, setBorrowDate] = useState('')
  const [borrowTime, setBorrowTime] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleBorrowClick = (items) => {
    setBorrowItem(items)
    setShowModal(true)
    setShowSuccess(false)
    setBorrowDate('')
    setBorrowTime('')
  }

  const handleConfirm = () => {
    if (!borrowDate || !borrowTime) {
      alert('Please select both a Date and a Time!')
      return
    }
    setShowSuccess(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setBorrowItem(null)
    setShowSuccess(false)
  }

  const itemCount = wishlist.length
  const btnLabel = itemCount === 1 ? '1 item' : `${itemCount} items`

  return (
    <>
      <style>{`
        /* ── HERO SECTION ── */
        .wishlist-hero-wrapper {
          position: relative;
          width: 100%;
          height: 70vh;
          overflow: hidden;
          background-color: #0f172a;
        }

        .wishlist-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        .wishlist-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.55);
          z-index: 1;
        }

        .wishlist-hero-content {
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

        .wishlist-hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
        }

        .wishlist-hero-content p {
          font-size: 1.15rem;
          margin-top: 12px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
        }

        .wishlist-count-badge {
          background-color: #0d6efd;
          color: #ffffff;
          border-radius: 50px;
          padding: 4px 14px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-left: 12px;
          vertical-align: middle;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
        }

        /* ── LIGHT THEME BODY SECTION ── */
        .wishlist-body-section {
          background-color: #ffffff;
          padding: 80px 0;
          min-height: 55vh;
        }

        /* ── CARDS WITH SOFT LIGHT-BLUE BORDER ── */
        .wishlist-item-card {
          background-color: #ffffff !important;
          border: 1.5px solid #bfdbfe !important;
          border-radius: 18px !important;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.04);
        }

        .wishlist-item-card:hover {
          transform: translateY(-4px);
          border-color: #93c5fd !important;
          box-shadow: 0 10px 24px rgba(13, 110, 253, 0.1) !important;
        }

        .wishlist-img-container {
          position: relative;
          height: 220px;
          width: 100%;
          overflow: hidden;
          background-color: #f1f5f9;
        }

        .wishlist-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .wishlist-item-card:hover .wishlist-item-img {
          transform: scale(1.05);
        }

        .remove-wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #e11d48;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 3;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .remove-wishlist-btn:hover {
          background-color: #ffe4e6;
          transform: scale(1.1);
          color: #be123c;
        }

        .wishlist-card-title {
          color: #0f172a;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .wishlist-price-tag {
          color: #059669;
          font-weight: 700;
          font-size: 1rem;
        }

        /* ── BOTTOM BORROW CTA BUTTON ── */
        .borrow-cta-btn {
          border-radius: 50px;
          font-weight: 700;
          transition: all 0.25s ease;
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border: none;
          color: #ffffff;
          padding: 16px 44px;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(13, 110, 253, 0.35);
        }

        .borrow-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.45);
        }

        /* ── EMPTY & NOT LOGGED IN STATES ── */
        .empty-state-box {
          max-width: 460px;
          margin: 0 auto;
          padding: 50px 20px;
          text-align: center;
        }

        .empty-state-icon {
          font-size: 4rem;
          color: #bfdbfe;
          margin-bottom: 20px;
        }

        .empty-state-title {
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .empty-state-text {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        /* ── BOOKING MODAL STYLING ── */
        .wb-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
        }

        .wb-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
          border: 1px solid #bfdbfe;
          animation: modalPop 0.25s ease-out;
        }

        @keyframes modalPop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .wb-box h5 {
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .wb-item-name {
          color: #0d6efd;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .wb-box label {
          font-size: 0.88rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
          display: block;
        }

        .wb-box input {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.95rem;
          margin-bottom: 16px;
          color: #0f172a;
          transition: border-color 0.2s ease;
        }

        .wb-box input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }

        .wb-success {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: 14px;
          padding: 24px 20px;
          text-align: center;
          color: #166534;
        }

        .wb-success .success-icon {
          font-size: 3rem;
          margin-bottom: 8px;
        }

        .wb-success h5 {
          font-weight: 800;
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: #15803d;
        }

        .wb-success p {
          font-size: 0.9rem;
          color: #166534;
          line-height: 1.5;
          margin: 0;
        }

        .wb-success .email-note {
          margin-top: 12px;
          font-size: 0.82rem;
          color: #166534;
          background: rgba(22, 101, 52, 0.08);
          border-radius: 8px;
          padding: 8px 12px;
        }
      `}</style>

      <Header hideHero={true} />

      {/* Booking Confirmation Modal */}
      {showModal && (
        <div className="wb-overlay" onClick={closeModal}>
          <div className="wb-box" onClick={(e) => e.stopPropagation()}>
            {showSuccess ? (
              <div>
                <div className="wb-success">
                  <div className="success-icon">✅</div>
                  <h5>Booking Confirmed!</h5>
                  <p>
                    {Array.isArray(borrowItem) &&
                      borrowItem.map((it, i) => (
                        <span key={i}>
                          <strong>{it.name || it.itemName}</strong>
                          {i < borrowItem.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    {' '}booked for <strong>{borrowDate}</strong> at <strong>{borrowTime}</strong>.
                  </p>
                  <div className="email-note">
                    📧 Confirmation email sent to your registered email!
                  </div>
                </div>
                <button 
                  className="btn btn-primary rounded-pill w-100 mt-3 py-2 fw-semibold" 
                  onClick={closeModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h5>📦 Confirm Borrow Request</h5>
                <div className="mb-3 p-3 bg-light rounded-3">
                  {Array.isArray(borrowItem) &&
                    borrowItem.map((it, i) => (
                      <p key={i} className="wb-item-name mb-1">
                        • {it.name || it.itemName}
                        {it.perDayPrice ? ` — ₹${it.perDayPrice}/day` : ''}
                      </p>
                    ))}
                </div>

                <label htmlFor="wbDate">📅 Select Date</label>
                <input
                  id="wbDate"
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />

                <label htmlFor="wbTime">⏰ Select Time</label>
                <input
                  id="wbTime"
                  type="time"
                  value={borrowTime}
                  onChange={(e) => setBorrowTime(e.target.value)}
                />

                <div className="d-flex gap-2 mt-2">
                  <button 
                    className="btn btn-primary rounded-pill flex-grow-1 fw-bold py-2" 
                    onClick={handleConfirm}
                  >
                    Confirm Booking
                  </button>
                  <button 
                    className="btn btn-outline-secondary rounded-pill px-4 py-2" 
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="wishlist-hero-wrapper">
        <img
          src={wishimg}
          alt="Wishlist Hero"
          className="wishlist-hero-image"
        />
        <div className="wishlist-hero-overlay"></div>
        <div className="wishlist-hero-content">
          <h1>
            Your Wishlist
            {wishlist.length > 0 && (
              <span className="wishlist-count-badge">{wishlist.length}</span>
            )}
          </h1>
          {/* <p>
            Keep track of the premium gear and tools <br />
            you want to borrow for upcoming projects.
          </p> */}
        </div>
      </div>

      {/* Wishlist Items List Section */}
      <div className="wishlist-body-section">
        <div className="container">

          {/* Not logged in State */}
          {!isLoggedIn && (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h3 className="empty-state-title">Login to See Your Wishlist</h3>
              <p className="empty-state-text">
                You need to be signed in to view and save items to your wishlist.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/login" className="btn btn-primary px-4 rounded-pill fw-semibold py-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary px-4 rounded-pill fw-semibold py-2">
                  Register with Google
                </Link>
              </div>
            </div>
          )}

          {/* Logged in + Has Items */}
          {isLoggedIn && wishlist.length > 0 && (
            <div>
              <div className="row g-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="card h-100 wishlist-item-card">
                      <div className="wishlist-img-container">
                        <img
                          src={item.image}
                          alt={item.name || item.itemName}
                          className="wishlist-item-img"
                        />
                        <button
                          className="remove-wishlist-btn"
                          title="Remove from Wishlist"
                          onClick={() => toggleWishlist(item)}
                        >
                          <i className="fa-solid fa-heart"></i>
                        </button>
                      </div>

                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <h5 className="wishlist-card-title mb-2">
                            {item.name || item.itemName}
                          </h5>
                          {item.perDayPrice && (
                            <span className="wishlist-price-tag">
                              ₹{item.perDayPrice}/day
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Multi-Item Confirmation CTA */}
              <div className="text-center mt-5">
                <button
                  className="borrow-cta-btn"
                  onClick={() => handleBorrowClick(wishlist)}
                >
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  Borrow All &amp; Place Confirmation ({btnLabel})
                </button>
              </div>
            </div>
          )}

          {/* Logged in + Empty Wishlist */}
          {isLoggedIn && wishlist.length === 0 && (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <i className="fa-regular fa-heart"></i>
              </div>
              <h3 className="empty-state-title">Your Wishlist is Empty</h3>
              <p className="empty-state-text">
                Explore available items and tap the ❤️ Heart icon to save them here for later.
              </p>
              <Link to="/" className="btn btn-primary px-4 rounded-pill fw-semibold py-2">
                Browse Items
              </Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  )
}

export default Wishlist