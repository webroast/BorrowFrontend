import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
// 👇 EDIT THIS PATH to point to your background image file
import contactBgImg from '../Images/Categories.png' 

const Contact = () => {
  return (
    <>
      <style>{`
        .contact-hero-wrapper {
          position: relative;
          width: 100%;
          height: 55vh;
          overflow: hidden;
          background-color: #0f172a;
        }

        /* ✅ Added background image styling matching the categories layout */
        .contact-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        /* ✅ Added dark overlay over the image so your text stays perfectly readable */
        .contact-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.65);
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
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .contact-hero-content p {
          font-size: 1.2rem;
          margin-top: 15px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
        }

        .contact-info-section {
          background-color: #0f172a;
          padding: 80px 0;
        }

        .contact-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          background: rgba(255, 255, 255, 0.06) !important;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 20px !important;
        }

        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
          border-color: #0d6efd !important;
        }

        .contact-icon {
          font-size: 3.5rem;
          margin-bottom: 15px;
          color: #0d6efd;
          display: inline-block;
        }

        .contact-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: #0d6efd;
        }
      `}</style>

      {/* Top White Bar + Navbar only */}
      <Header hideHero={true} />

      {/* Hero Header Section with Background Image */}
      <div className="contact-hero-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1640969178204-261969c1305c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Contact Us Background" 
          className="contact-hero-image" 
        />
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Contact Our Team</h1>
          <p>Got questions about borrowing or listing? <br />We're here to help you pull it off seamlessly.</p>
        </div>
      </div>

      {/* Contact Cards Grid Section */}
      <div className="contact-info-section text-white">
        <div className="container">
          <div className="row g-4 justify-content-center">
            
            {/* Phone & WhatsApp Contact Card */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 p-4 text-center contact-card text-white">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <span className="contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <h4 className="card-title fw-bold mb-3">Call or WhatsApp</h4>
                  <p className="card-text text-secondary small mb-4">
                    Reach us directly for swift platform support and order queries.
                  </p>
                  <a href="tel:+918942008221" className="fw-bold contact-link">
                    +91 8942 00 8221
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram Contact Card */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 p-4 text-center contact-card text-white">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <span className="contact-icon">
                    <i className="fa-brands fa-instagram"></i>
                  </span>
                  <h4 className="card-title fw-bold mb-3">Instagram DM</h4>
                  <p className="card-text text-secondary small mb-4">
                    Follow our updates or drop us a message anytime on social media.
                  </p>
                  <a href="#" className="fw-bold contact-link">
                    @justborrrowit
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Contact