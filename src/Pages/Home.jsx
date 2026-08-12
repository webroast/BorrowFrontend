import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import heroVideo from '../Images/HeroVideo.mp4'

import cardsData from '../Images/CardData.json'
import initialItemsData from '../Images/itemsData.json'

const Home = () => {

  return (
    <>
      <style>
        {`
          .card-section, .trending-section {
            padding: 80px 0;
            background-color: #f8f9fa; 
          }
          .category-header {
            margin-bottom: 40px;
          }
          .section-main-title {
            color: #212529;
            font-size: 2.25rem;
            letter-spacing: 0.5px;
          }
          .category-underline, .steps-underline, .trending-underline, .trust-underline, .news-underline {
            width: 60px;
            height: 4px;
            background-color: #0d6efd;
            margin: 12px auto 0 auto;
            border-radius: 2px;
          }
          .steps-subtitle {
            color: #6c757d;
            font-size: 1.1rem;
            margin-top: 15px;
          }
          /* ── Browse Category Card styles ── */
          .custom-card {
            border: none;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            position: relative;
            cursor: pointer;
            transition: all 0.4s ease;
          }
          .custom-card.collapsed {
            height: 250px;
          }
          .card-img-wrapper {
            width: 100%;
            height: 250px;
            overflow: hidden;
            position: relative;
          }
          .card-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }
          .custom-card:hover .card-img-wrapper img {
            transform: scale(1.05);
          }
          .card-text-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4); 
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease, background-color 0.3s ease;
            z-index: 2;
            padding: 15px;
          }
          .card-overlay-title {
            color: #ffffff;
            font-size: 1.25rem;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
            margin: 0;
          }
          .custom-card:hover .card-text-overlay {
            opacity: 0;
            background-color: transparent;
          }
          /* ── How It Works ── */
          .how-it-works-section {
            padding: 80px 0;
            background-color: #ffffff; 
          }
          .step-box {
            padding: 30px 20px;
            text-align: center;
            transition: transform 0.3s ease;
          }
          .step-box:hover { transform: translateY(-5px); }
          .step-icon-wrapper {
            width: 80px;
            height: 80px;
            background-color: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            font-size: 2rem;
            position: relative;
          }
          .step-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 28px;
            height: 28px;
            background-color: #0d6efd;
            color: #ffffff;
            border-radius: 50%;
            font-size: 0.9rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .step-title { font-size: 1.4rem; color: #212529; margin-bottom: 12px; }
          .step-desc { color: #6c757d; font-size: 0.95rem; line-height: 1.6; }
          /* ── Trending Items ── */
          .trending-item-card {
            border: none;
            border-radius: 12px;
            background-color: #ffffff;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .trending-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          .wishlist-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10;
            transition: transform 0.2s ease;
            cursor: pointer;
          }
          .wishlist-btn:hover { transform: scale(1.1); }
          /* ── Trust section ── */
          .trust-section { padding: 80px 0; background-color: #ffffff; }
          .trust-card {
            background-color: #ffffff;
            border: 1px solid #eef2f5;
            border-radius: 12px;
            padding: 35px 25px;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          }
          .trust-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border-color: rgba(13, 110, 253, 0.2);
          }
          .trust-icon-box { font-size: 2.25rem; color: #0d6efd; margin-bottom: 20px; }
          .trust-card-title { font-size: 1.25rem; color: #212529; margin-bottom: 12px; }
          .trust-card-desc { color: #6c757d; font-size: 0.92rem; line-height: 1.6; margin: 0; }
          /* ── Lender CTA ── */
          .lender-cta-section { padding: 80px 0 40px 0; background-color: #f8f9fa; }
          .lender-banner-box {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 20px;
            padding: 60px 40px;
            color: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }
          .lender-heading { font-size: 2.5rem; letter-spacing: 0.5px; }
          .lender-description { color: #cbd5e1; font-size: 1.1rem; max-width: 700px; margin: 0 auto 30px auto; line-height: 1.7; }
          .lender-signup-btn {
            background-color: #0d6efd;
            color: #ffffff;
            font-weight: 600;
            padding: 14px 40px;
            font-size: 1.05rem;
            border-radius: 50px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
          }
          .lender-signup-btn:hover { background-color: #0b5ed7; color: #ffffff; transform: translateY(-2px); }
          /* ── Newsletter ── */
          .newsletter-section { padding: 60px 0 80px 0; background-color: #f8f9fa; }
          .newsletter-input-group {
            max-width: 550px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 6px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .newsletter-input { border: none; padding: 12px 25px; font-size: 1rem; border-radius: 50px; outline: none; width: 70%; }
          .newsletter-submit-btn {
            background-color: #212529;
            color: #ffffff;
            border: none;
            border-radius: 50px;
            padding: 12px 30px;
            font-weight: 600;
            transition: background-color 0.3s ease;
            width: 30%;
          }
          .newsletter-submit-btn:hover { background-color: #000000; }
        `}
      </style>

      {/* ── Header ── */}
      <Header videoSrc={heroVideo} />

      {/* ── Browse By Category ── */}
      <section className="card-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center category-header">
              <h2 className="section-main-title fw-bold m-0">Browse By Category</h2>
              <div className="category-underline"></div>
            </div>
          </div>
          <div className="row g-4">
            {cardsData.map((card) => (
              <div key={card.id} className="col-12 col-md-6 col-lg-3">
                <div className="card custom-card collapsed">
                  <div className="card-img-wrapper">
                    <img src={card.image} alt={card.name} />
                    <div className="card-text-overlay text-center">
                      <h5 className="card-overlay-title fw-bold">{card.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-main-title fw-bold m-0">How It Works</h2>
              <div className="steps-underline"></div>
              <p className="steps-subtitle fw-semibold">Rates for Hourly And For the day will diffrent</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="step-box">
                <div className="step-icon-wrapper">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <div className="step-badge">1</div>
                </div>
                <h4 className="step-title fw-bold">Browse & Pick dates</h4>
                <p className="step-desc">Search through local listings, find the item you need, and choose your required rental start and end dates.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="step-box">
                <div className="step-icon-wrapper">
                  <i className="fa-solid fa-calendar-check"></i>
                  <div className="step-badge">2</div>
                </div>
                <h4 className="step-title fw-bold">Book & confirm</h4>
                <p className="step-desc">Connect directly with verified lenders, select your collection method, and securely confirm your order setup.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="step-box">
                <div className="step-icon-wrapper">
                  <i className="fa-solid fa-face-smile"></i>
                  <div className="step-badge">3</div>
                </div>
                <h4 className="step-title fw-bold">Pickup and enjoy</h4>
                <p className="step-desc">Collect the gear safely, complete your project or event successfully, and return the item on schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Rentals ── */}
      <section className="trending-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-main-title fw-bold m-0">Trending Rentals</h2>
              <div className="trending-underline"></div>
            </div>
          </div>
          <div className="row g-4">
            {initialItemsData.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 trending-item-card position-relative">
                  <button className="wishlist-btn" title="Add to Wishlist">
                    <i className="fa-heart fa-regular text-secondary"></i>
                  </button>

                  <img
                    src={item.image}
                    alt={item.itemName}
                    style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-2">{item.itemName}</h5>
                      <div className="mb-3 text-warning">
                        <i className="fa-solid fa-star me-1"></i>
                        <span className="text-muted small fw-bold">({item.starRating})</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <span className="fs-5 fw-bold text-dark">
                        ₹{item.perDayPrice} <small className="text-muted fw-normal">/ day</small>
                      </span>
                      <button className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold">
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="trust-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-main-title fw-bold m-0">Why Choose Us</h2>
              <div className="trust-underline"></div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="trust-card text-center h-100">
                <div className="trust-icon-box"><i className="fa-solid fa-wallet"></i></div>
                <h4 className="trust-card-title fw-bold">Save Money vs Buying</h4>
                <p className="trust-card-desc">Access premium gear for a fraction of its total retail cost. Rent only for the exact period you need it.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="trust-card text-center h-100">
                <div className="trust-icon-box"><i className="fa-solid fa-user-shield"></i></div>
                <h4 className="trust-card-title fw-bold">Verified Listings</h4>
                <p className="trust-card-desc">Shop with complete peace of mind. Every product profile and local vendor is thoroughly vetted before going live.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="trust-card text-center h-100">
                <div className="trust-icon-box"><i className="fa-solid fa-shield-halved"></i></div>
                <h4 className="trust-card-title fw-bold">Safe and Secure</h4>
                <p className="trust-card-desc">All platform transactions and user interactions are protected by advanced top-tier standard encryption layers.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="trust-card text-center h-100">
                <div className="trust-icon-box"><i className="fa-solid fa-truck-ramp-box"></i></div>
                <h4 className="trust-card-title fw-bold">Easy Pickup & Return</h4>
                <p className="trust-card-desc">Coordinate seamless asset exchange directly through rapid handovers or flexible scheduled returns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lender CTA ── */}
      <section className="lender-cta-section">
        <div className="container text-center">
          <div className="lender-banner-box">
            <h2 className="lender-heading fw-bold mb-3">Make Money Sitting At Home</h2>
            <p className="lender-description">
              Have extra tools, cameras, party supplies, or gaming rigs lying around? Put your underutilized gear to work! List your items securely on our marketplace, set your custom pricing schedules, and watch your items generate consistent passive income today.
            </p>
            <Link to="/login" className="lender-signup-btn">Start Lending Now</Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="section-main-title fw-bold m-0">Stay Updated</h2>
              <div className="news-underline"></div>
              <p className="steps-subtitle m-0 mt-3">Get notified about new listings near you.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form className="newsletter-input-group d-flex align-items-center justify-content-between">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address..."
                />
                <button type="submit" className="newsletter-submit-btn">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <Footer />
    </>
  )
}

export default Home