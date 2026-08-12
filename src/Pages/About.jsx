import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import aboutVideo from '../Images/AboutusVideo.mp4'

const About = () => {
  return (
    <>
      <style>
        {`
          /* --- ABOUT CONTENT SECTION DESIGN --- */
          .about-content-section {
            padding: 80px 0;
            background-color: #ffffff;
          }

          .about-title {
            color: #212529;
            font-size: 2.25rem;
            letter-spacing: 0.5px;
          }

          .about-underline {
            width: 60px;
            height: 4px;
            background-color: #0d6efd;
            margin: 12px 0 0 0;
            border-radius: 2px;
          }

          .about-underline-center {
            margin: 12px auto 0 auto;
          }

          .lead-text {
            font-size: 1.15rem;
            color: #495057;
            line-height: 1.8;
          }

          /* --- STATS ACCENT ROW STYLES --- */
          .about-stats-section {
            padding: 60px 0;
            background-color: #f8f9fa; /* Uniform blended light background */
          }

          .stat-box {
            text-align: center;
            padding: 20px;
          }

          .stat-number {
            font-size: 2.75rem;
            color: #0d6efd;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 1rem;
            color: #6c757d;
            font-weight: 600;
            text-uppercase: uppercase;
            letter-spacing: 0.5px;
          }

          /* --- VALUE CARD STYLES --- */
          .value-card {
            border: 1px solid #eef2f5;
            border-radius: 12px;
            padding: 30px 25px;
            background-color: #ffffff;
            transition: transform 0.3s ease;
            height: 100%;
          }

          .value-card:hover {
            transform: translateY(-5px);
          }

          .value-icon {
            font-size: 2rem;
            color: #0d6efd;
            margin-bottom: 15px;
          }
        `}
      </style>

      {/* 1. Header Hero with customized Video and Content props */}
      <div>
        <Header
          videoSrc={aboutVideo}
          heroTitle="About justborrowit"
          heroSubtitle="Building a Smarter Sharing Community."
          heroBtnText="See How It Works"
          heroBtnLink="/howitworks"
        />
      </div>

      {/* 2. Primary Story / Mission Statement Section */}
      <section className="about-content-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <h2 className="about-title fw-bold m-0">Our Mission & Vision</h2>
              <div className="about-underline mb-4"></div>
              <p className="lead-text fw-semibold mb-3">
                We believe ownership shouldn't limit accessibility.
              </p>
              <p className="text-muted mb-4" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                Born out of the desire to make premium gear accessible to everyone, <strong>justborrowit</strong> connects thousands of local item owners with creators, adventurers, and everyday people who need temporary tools. By creating a transparent, peer-to-peer ecosystem, we minimize industrial waste, maximize resource value, and keep hard-earned money in your wallet.
              </p>
            </div>
            
            <div className="col-12 col-lg-6">
              {/* Clean decorative placeholder block matching the dark aesthetic */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                padding: '50px 40px',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)'
              }}>
                <h4 className="fw-bold mb-3 text-white">Why it matters to us</h4>
                <p className="mb-0" style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.92rem' }}>
                  The average household power drill is used for a combined total of only 13 minutes in its entire lifespan. We are here to change that narrative. Through collective resource sharing, we make sure every camera lens, speaker system, and camping setup lives its full potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Platform Milestones & Statistics Accents */}
      <section className="about-stats-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number fw-bold">10K+</div>
                <div className="stat-label">Verified Listings</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number fw-bold">₹5M+</div>
                <div className="stat-label">Lender Earnings</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number fw-bold">15K+</div>
                <div className="stat-label">Happy Renters</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number fw-bold">99.8%</div>
                <div className="stat-label">Safety Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Grid Section */}
      <section className="about-content-section bg-white">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="about-title fw-bold m-0">Our Core Principles</h2>
              <div className="about-underline about-underline-center"></div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-users"></i></div>
                <h4 className="fw-bold text-dark mb-2">Community First</h4>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Building hyper-local bonds through trust, mutual reliance, and verified profile tracking systems.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-leaf"></i></div>
                <h4 className="fw-bold text-dark mb-2">Sustainability</h4>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Reducing retail carbon emissions by limiting absolute manufacturing demand through collaborative utility.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="value-card">
                <div className="value-icon"><i className="fa-solid fa-face-smile-beam"></i></div>
                <h4 className="fw-bold text-dark mb-2">Absolute Security</h4>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Providing smooth protection policies, strict encryption loops, and transparent interaction rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default About