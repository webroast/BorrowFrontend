import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import howitWorksVideo from '../Images/HowitworksVideo.mp4'

const Howitworks = () => {
  // Toggle between 'renter' and 'lender' journeys
  const [activeTab, setActiveTab] = useState('renter');

  return (
    <>
      <style>
        {`
          .tab-btn {
            border: 2px solid #0d6efd;
            background: transparent;
            color: #0d6efd;
            padding: 12px 30px;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s ease;
          }

          .tab-btn.active {
            background-color: #0d6efd;
            color: #ffffff;
          }

          .step-card {
            background: #ffffff;
            border: 1px solid #eef2f5;
            border-radius: 16px;
            padding: 40px 30px;
            height: 100%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            transition: transform 0.3s ease;
          }

          .step-card:hover {
            transform: translateY(-5px);
          }

          .step-number {
            font-size: 3rem;
            font-weight: 800;
            color: rgba(13, 110, 253, 0.15);
            line-height: 1;
            margin-bottom: 15px;
          }

          .pricing-notice-box {
            background-color: #fff3cd;
            border: 1px solid #ffe69c;
            border-radius: 12px;
            padding: 25px;
            color: #664d03;
          }
        `}
      </style>

      {/* 1. Header Hero with customized Video and Content props */}
      <Header
        videoSrc={howitWorksVideo}
        heroTitle="How justborrowit Works"
        heroSubtitle="Simple, secure, and sustainable peer-to-peer rentals."
        heroBtnText="Get Started"
        heroBtnLink="/login"
      />

      {/* 2. Interactive Renter vs Lender Tabs Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-center gap-3 mb-5">
            <button 
              className={`tab-btn ${activeTab === 'renter' ? 'active' : ''}`}
              onClick={() => setActiveTab('renter')}
            >
              I Want to Rent
            </button>
            <button 
              className={`tab-btn ${activeTab === 'lender' ? 'active' : ''}`}
              onClick={() => setActiveTab('lender')}
            >
              I Want to Earn / Lend
            </button>
          </div>

          {/* RENTER PATHWAY STEPS */}
          {activeTab === 'renter' && (
            <div className="row g-4">
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <h4 className="fw-bold text-dark">Search Listings</h4>
                  <p className="text-muted mb-0">Enter your location or search by category to find available items near you. Filter by specific dates, item conditions, or rental rates.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">02</div>
                  <h4 className="fw-bold text-dark">Select Duration & Request</h4>
                  <p className="text-muted mb-0">Pick your required timeframe. Review the flexible rate structures offered by the lender and send a booking request.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">03</div>
                  <h4 className="fw-bold text-dark">Pickup & Return</h4>
                  <p className="text-muted mb-0">Coordinate a hand-off point safely with the verified lender, use the gear for your event or task, and return it in original condition.</p>
                </div>
              </div>
            </div>
          )}

          {/* LENDER PATHWAY STEPS */}
          {activeTab === 'lender' && (
            <div className="row g-4">
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">01</div>
                  <h4 className="fw-bold text-dark">List Your Gear</h4>
                  <p className="text-muted mb-0">Upload high-quality images of your items, specify exact condition updates, and write a helpful summary description.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">02</div>
                  <h4 className="fw-bold text-dark">Set Flexible Rates</h4>
                  <p className="text-muted mb-0">Determine separate custom price options for hourly drop-offs or full-day loans to optimize your earnings potential.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="step-card">
                  <div className="step-number">03</div>
                  <h4 className="fw-bold text-dark">Approve & Get Paid</h4>
                  <p className="text-muted mb-0">Accept verification requests from trusted members, complete the safe pickup handover, and withdraw cash payouts directly.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Hourly vs Daily Price Clarity Block */}
      <section className="py-5 bg-white">
        <div className="container">
          {/* Rate Notice Box (Added mb-4 to separate the two boxes nicely) */}
          <div className="pricing-notice-box shadow-sm d-flex align-items-start gap-3 mb-4">
            <i className="fa-solid fa-circle-info fs-4 mt-1"></i>
            <div>
              <h5 className="fw-bold mb-1">Important Note About Rental Rates</h5>
              <p className="mb-0">
                To keep sharing fair and practical, <strong>rates for hourly durations and full-day durations will be completely different</strong>. Lenders optimize pricing templates relative to active time frames, allowing you to access premium gear at lower costs if you only need it for brief projects!
              </p>
            </div>
          </div>

          {/* 👇 NEW CODE: Late Return Warning Notice Box */}
          <div className="pricing-notice-box shadow-sm d-flex align-items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation fs-4 mt-1"></i>
            <div>
              <h5 className="fw-bold mb-1">Important Note About Late Returns</h5>
              <p className="mb-0">
                Please ensure you plan your rental period carefully! <strong>Returning the product not on time will lead to extra charges</strong>. Late returns impact other platform members who may have booked the item right after you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action CTA Block */}
      <section className="py-5 bg-light border-top">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to join the sharing economy?</h3>
          <p className="text-muted mb-4">Create your account now and connect with trusted locals instantly.</p>
          <Link to="/login" className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm">
            Get Started Today
          </Link>
        </div>
      </section><hr className='m-0'></hr>

      <Footer />
    </>
  )
}

export default Howitworks