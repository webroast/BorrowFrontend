import React, { useState } from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { Link } from 'react-router-dom'

const Wishlist = ({ wishlist = [], toggleWishlist, isLoggedIn }) => {

  const [borrowItem, setBorrowItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [borrowDate, setBorrowDate] = useState('');
  const [borrowTime, setBorrowTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBorrowClick = (items) => {
    setBorrowItem(items);
    setShowModal(true);
    setShowSuccess(false);
    setBorrowDate('');
    setBorrowTime('');
  };

  const handleConfirm = () => {
    if (!borrowDate || !borrowTime) {
      alert('Please select both a Date and a Time!');
      return;
    }
    setShowSuccess(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBorrowItem(null);
    setShowSuccess(false);
  };

  // Helper: item count label
  const itemCount = wishlist.length;
  const btnLabel = itemCount === 1 ? '1 item' : itemCount + ' items';

  return (
    <>
      <style>{`
        .wishlist-hero-wrapper { position: relative; width: 100%; height: 40vh; overflow: hidden; background-color: #0f172a; }
        .wishlist-hero-image { width: 100%; height: 100%; object-fit: cover; filter: grayscale(25%); }
        .wishlist-hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); z-index: 1; }
        .wishlist-hero-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #fff; padding: 0 20px; }
        .wishlist-hero-content h1 { font-size: 3rem; font-weight: 800; text-shadow: 2px 2px 8px rgba(0,0,0,0.6); }
        .wishlist-hero-content p { font-size: 1.2rem; margin-top: 15px; color: #e2e8f0; }
        .wishlist-count-badge { background: #0d6efd; color: white; border-radius: 50px; padding: 4px 14px; font-size: 0.9rem; font-weight: 700; margin-left: 10px; }
        .wishlist-body-section { background-color: #0f172a; padding: 80px 0; min-height: 50vh; }
        .wishlist-item-card { background: rgba(255,255,255,0.05) !important; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.12) !important; border-radius: 20px !important; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .wishlist-item-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.35) !important; }
        .wishlist-img-container { position: relative; height: 200px; width: 100%; overflow: hidden; }
        .wishlist-item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .wishlist-item-card:hover .wishlist-item-img { transform: scale(1.06); }
        .remove-wishlist-btn { position: absolute; top: 15px; right: 15px; background: rgba(15,23,42,0.7); border: none; color: #ef4444; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; z-index: 3; }
        .remove-wishlist-btn:hover { background: rgba(239,68,68,0.2); transform: scale(1.1); color: #f87171; }
        .borrow-cta-btn { border-radius: 50px; font-weight: 700; transition: all 0.2s ease; background: #0d6efd; border: none; color: #fff; padding: 16px 40px; font-size: 1.05rem; cursor: pointer; }
        .borrow-cta-btn:hover { background: #0b5ed7; transform: translateY(-2px); }
        .empty-wishlist-box { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
        .empty-wishlist-icon { font-size: 4.5rem; color: rgba(255,255,255,0.15); margin-bottom: 20px; }
        .not-logged-in-box { max-width: 480px; margin: 0 auto; padding: 40px 20px; text-align: center; }
        .wb-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .wb-box { background: #fff; border-radius: 20px; padding: 35px; width: 90%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .wb-box h5 { font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .wb-item-name { color: #0d6efd; font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; }
        .wb-box label { font-size: 0.88rem; font-weight: 600; color: #475569; margin-bottom: 5px; display: block; }
        .wb-box input { width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 0.95rem; margin-bottom: 16px; }
        .wb-box input:focus { outline: 2px solid #0d6efd; border-color: transparent; }
        .wb-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 24px 20px; text-align: center; color: #166534; }
        .wb-success .success-icon { font-size: 3rem; margin-bottom: 10px; }
        .wb-success h5 { font-weight: 800; font-size: 1.2rem; margin-bottom: 6px; color: #15803d; }
        .wb-success p { font-size: 0.88rem; color: #166534; margin: 0; }
        .wb-success .email-note { margin-top: 10px; font-size: 0.82rem; color: #166534; background: rgba(0,0,0,0.05); border-radius: 8px; padding: 8px 12px; }
      `}</style>

      <Header hideHero={true} />

      {/* Borrow modal */}
      {showModal && (
        <div className="wb-overlay" onClick={closeModal}>
          <div className="wb-box" onClick={function(e){ e.stopPropagation(); }}>
            {showSuccess ? (
              <div>
                <div className="wb-success">
                  <div className="success-icon">✅</div>
                  <h5>Booking Confirmed!</h5>
                  <p>
                    {Array.isArray(borrowItem) && borrowItem.map(function(it, i) {
                      return <span key={i}><strong>{it.name || it.itemName}</strong>{i < borrowItem.length - 1 ? ', ' : ''}</span>;
                    })}
                    {' '}booked for <strong>{borrowDate}</strong> at <strong>{borrowTime}</strong>.
                  </p>
                  <div className="email-note">📧 Confirmation email sent to your registered email!</div>
                </div>
                <button className="btn btn-outline-primary rounded-pill w-100 mt-3" onClick={closeModal}>Done</button>
              </div>
            ) : (
              <div>
                <h5>📦 Place Borrow Confirmation</h5>
                <div className="mb-3">
                  {Array.isArray(borrowItem) && borrowItem.map(function(it, i) {
                    return (
                      <p key={i} className="wb-item-name mb-1">
                        • {it.name || it.itemName}{it.perDayPrice ? ' — ₹' + it.perDayPrice + '/day' : ''}
                      </p>
                    );
                  })}
                </div>
                <label htmlFor="wbDate">📅 Select Date</label>
                <input id="wbDate" type="date" value={borrowDate} onChange={function(e){ setBorrowDate(e.target.value); }} min={new Date().toISOString().split('T')[0]} />
                <label htmlFor="wbTime">⏰ Select Time</label>
                <input id="wbTime" type="time" value={borrowTime} onChange={function(e){ setBorrowTime(e.target.value); }} />
                <div className="d-flex gap-2 mt-1">
                  <button className="btn btn-primary rounded-pill flex-grow-1 fw-bold" onClick={handleConfirm}>Confirm Booking</button>
                  <button className="btn btn-outline-secondary rounded-pill" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="wishlist-hero-wrapper">
        <img src="https://images.unsplash.com/photo-1605364850025-1c59327db3b1?q=80&w=1320&auto=format&fit=crop" alt="Wishlist" className="wishlist-hero-image" />
        <div className="wishlist-hero-overlay"></div>
        <div className="wishlist-hero-content pt-5">
          <h1 className="mt-3">
            Your Wishlist
            {wishlist.length > 0 && <span className="wishlist-count-badge">{wishlist.length}</span>}
          </h1>
          <p>Keep track of the premium gear and tools <br />you want to borrow for upcoming projects.</p>
        </div>
      </div>

      {/* Body */}
      <div className="wishlist-body-section text-white">
        <div className="container">

          {/* NOT logged in */}
          {!isLoggedIn && (
            <div className="not-logged-in-box">
              <div className="empty-wishlist-icon"><i className="fa-solid fa-lock"></i></div>
              <h3 className="fw-bold mb-2">Login to See Your Wishlist</h3>
              <p className="text-secondary small mb-4">You need to be logged in to save items.</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/login" className="btn btn-primary px-4 rounded-pill fw-semibold py-2">Login</Link>
                <Link to="/register" className="btn btn-outline-light px-4 rounded-pill fw-semibold py-2">Register with Google</Link>
              </div>
            </div>
          )}

          {/* Logged in + HAS items */}
          {isLoggedIn && wishlist.length > 0 && (
            <div>
              <div className="row g-4">
                {wishlist.map(function(item) {
                  return (
                    <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                      <div className="card h-100 wishlist-item-card text-white">
                        <div className="wishlist-img-container">
                          <img src={item.image} alt={item.name || item.itemName} className="wishlist-item-img" />
                          <button className="remove-wishlist-btn" title="Remove from Wishlist" onClick={function(){ toggleWishlist(item); }}>
                            <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                        <div className="card-body p-4">
                          <h5 className="card-title fw-bold mt-1 mb-2 text-white">{item.name || item.itemName}</h5>
                          {item.perDayPrice && <h6 className="fw-bold text-success mb-2">₹{item.perDayPrice}/day</h6>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Single bottom button for ALL items */}
              <div className="text-center mt-5">
                <button className="borrow-cta-btn" onClick={function(){ handleBorrowClick(wishlist); }}>
                  <i className="fa-solid fa-calendar-check me-2"></i>
                  Borrow All &amp; Place Confirmation ({btnLabel})
                </button>
              </div>
            </div>
          )}

          {/* Logged in + EMPTY */}
          {isLoggedIn && wishlist.length === 0 && (
            <div className="empty-wishlist-box text-center py-5">
              <div className="empty-wishlist-icon"><i className="fa-regular fa-heart"></i></div>
              <h3 className="fw-bold mb-2">There is nothing in your Wishlist</h3>
              <p className="text-secondary small mb-4">Browse items and tap the ❤️ Heart icon to save them here.</p>
              <Link to="/" className="btn btn-primary px-4 rounded-pill fw-semibold py-2">Browse Items</Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Wishlist