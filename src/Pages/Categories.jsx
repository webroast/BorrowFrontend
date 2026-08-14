import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import catimg from '../Images/CategoriesBackground.png'

const Categories = () => {

  return (
    <>
      <style>{`
        .categories-hero-wrapper {
          position: relative;
          width: 100%;
          height: 90vh;
          overflow: hidden;
        }

        .categories-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        .categories-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.30);
          z-index: 1;
        }

        .categories-hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 0 60px;
        }

        /* LEFT SIDE - Title */
        .categories-left-text {
          flex: 1;
          color: #ffffff;
          padding-right: 40px;
        }

        .categories-left-text h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
        }

        .categories-left-text p {
          font-size: 1.2rem;
          margin-top: 15px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
        }

        /* RIGHT SIDE */
        .categories-right-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* FAQ CUSTOM STYLES (SOFT LIGHT-BLUE ACCENT THEME) */
        .faq-section {
          background-color: #ffffff; 
          padding: 80px 0;
        }

        .faq-section h2 {
          color: #0f172a;
        }

        .faq-accordion .accordion-item {
          background-color: #ffffff !important;
          border: 1.5px solid #bfdbfe !important; /* Soft light-blue border */
          border-radius: 14px !important;
          margin-bottom: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.04);
          transition: all 0.25s ease-in-out;
        }

        .faq-accordion .accordion-item:hover {
          border-color: #93c5fd !important; /* Slightly deeper on hover */
          box-shadow: 0 6px 16px rgba(13, 110, 253, 0.08);
          transform: translateY(-2px);
        }

        .faq-accordion .accordion-button {
          background-color: transparent !important;
          color: #1e293b !important;
          font-weight: 600;
          font-size: 1.05rem;
          padding: 20px 24px;
          box-shadow: none !important;
          width: 100%;
          text-align: left;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 0.2s ease;
        }

        .faq-accordion .accordion-button:not(.collapsed) {
          color: #0d6efd !important;
          background-color: #f8faff !important; /* Very subtle blue tint when open */
        }

        .faq-arrow {
          transition: transform 0.25s ease;
          font-size: 0.8rem;
          color: #60a5fa;
        }
        
        .faq-accordion .accordion-button:not(.collapsed) .faq-arrow {
          transform: rotate(180deg);
          color: #0d6efd;
        }

        .faq-accordion .accordion-body {
          color: #475569 !important; 
          line-height: 1.7;
          font-size: 0.95rem;
          padding: 20px 24px;
          background-color: #ffffff;
          border-top: 1px solid #e0f2fe; /* Soft divider inside */
        }
      `}</style>

      {/* Top White Bar + Navbar only */}
      <Header hideHero={true} />

      {/* Hero Section */}
      <div className="categories-hero-wrapper">
        <img
          src={catimg}
          alt="Categories Background"
          className="categories-hero-image"
        />
        <div className="categories-hero-overlay"></div>
        <div className="categories-hero-content">
          {/* <div className="categories-left-text">
            <h1>Explore Our Categories</h1>
            <p>Find anything you need — <br />borrow it, use it, return it.</p>
          </div> */}
          <div className="categories-right-content"></div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="faq-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="text-center mb-5">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
            <p className="text-muted">Got questions about how borrowing works? We have answers.</p>
          </div>

          <div className="accordion faq-accordion">
            
            {/* FAQ Item 1 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button"
                >
                  <span>How do rental rates work?</span>
                  <span className="faq-arrow">▼</span>
                </button>
              </h2>
              <div className="accordion-body">
                To keep sharing fair and highly practical, rental rates for hourly durations and full-day durations are calculated differently. Lenders set custom pricing templates depending on the timeframe, meaning you can easily grab premium equipment at a fraction of the cost if you only need it for a fast, short-term task!
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button"
                >
                  <span>What happens if I don't return an item on time?</span>
                  <span className="faq-arrow">▼</span>
                </button>
              </h2>
              <div className="accordion-body">
                Timelines matter immensely to our sharing community! Returning products late will directly lead to extra charges. This system ensures that items are returned on time so they don't disrupt upcoming reservations booked by your neighbors.
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button"
                >
                  <span>How do I connect with a lender to grab an item?</span>
                  <span className="faq-arrow">▼</span>
                </button>
              </h2>
              <div className="accordion-body">
                Once you find an item inside a category, simply pick your required time slots and submit a request. Once approved, you can safely chat directly with the verified community lender to set a secure local pickup location.
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button"
                >
                  <span>Is it free to create an account and list items?</span>
                  <span className="faq-arrow">▼</span>
                </button>
              </h2>
              <div className="accordion-body">
                Absolutely! Registering an account and listing your gear to earn extra cash is 100% free. We only secure a processing percentage during successful transactions to keep the platform running seamlessly.
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Categories