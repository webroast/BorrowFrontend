import React from 'react'
import { Link } from 'react-router-dom'
import '../CSS/Footer.css'

const Footer = () => {
  return (
    <footer className="footer-bg pt-5 pb-4 position-relative">
      <div className="container">
        <div className="row">
          
          {/* Column 1: Brand & About */}
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mb-4">
            <div className="brand-text mb-3 d-flex align-items-center fw-bold fs-4 text-dark">
              {/* Changed icon and name to match your topic */}
              <i className="fa-solid fa-handshake-angle me-2 text-primary"></i> justborrowit
            </div>
            <p className="text-muted pe-4" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Empowering communities to borrow anything and save everything. Rent premium gear locally from verified lenders with total confidence and ease.
            </p>
            <div className="mt-3">
              <a href="#/" className="footer-link me-3 fs-5"><i className="fa-brands fa-square-instagram"></i></a>
              <a href="#/" className="footer-link me-3 fs-5"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="#/" className="footer-link fs-5"><i className="fa-solid fa-phone"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase footer-heading mb-4 fw-bold text-dark">Browse Rentals</h6>
            <p className="mb-2"><Link to="/categories" className="footer-link">Cameras & Gear</Link></p>
            <p className="mb-2"><Link to="/categories" className="footer-link">Party & Supplies</Link></p>
            <p className="mb-2"><Link to="/categories" className="footer-link">Tools & Equipment</Link></p>
            <p className="mb-2"><Link to="/login" className="footer-link">Become a Lender</Link></p>
          </div>

          {/* Column 3: Support */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase footer-heading mb-4 fw-bold text-dark">Support</h6>
            <p className="mb-2"><Link to="/about" className="footer-link">About Our Mission</Link></p>
            <p className="mb-2"><Link to="/contactus" className="footer-link">Contact Support</Link></p>
            <p className="mb-2"><Link to="/howitworks" className="footer-link">How It Works</Link></p>
            <p className="mb-2"><Link to="/reviews" className="footer-link">Trust & Reviews</Link></p>
          </div>

          {/* Column 4: Legal Policy */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
            <h6 className="text-uppercase footer-heading mb-4 fw-bold text-dark">Legal Policy</h6>
            <p className="mb-2"><a href="#/" className="footer-link">Privacy Policy</a></p>
            <p className="mb-2"><a href="#/" className="footer-link">Terms of Service</a></p>
            <p className="mb-2"><a href="#/" className="footer-link">Lender Insurance Rules</a></p>
            <p className="mb-2"><a href="#/" className="footer-link">Cookies Settings</a></p>
          </div>
        </div>

        {/* Horizontal Divider */}
        <hr className="mb-4" style={{ borderColor: '#cbd5e1' }} />

        {/* Bottom Copyright & Small Links */}
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="bottom-text mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
              © 2026 justborrowit. Borrow Anything, Save Everything. All rights reserved.
            </p>
          </div>
          <div className="col-md-5 col-lg-4 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-4" style={{ fontSize: '0.85rem' }}>
            <a href="#/" className="bottom-text text-decoration-none text-muted">Accessibility</a>
            <a href="#/" className="bottom-text text-decoration-none text-muted">Rental Safety Tips</a>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Chat) */}
      {/* <a href="#/" className="chat-btn">
        <i className="fa-solid fa-comment-dots"></i>
      </a> */}
    </footer>
  )
}

export default Footer