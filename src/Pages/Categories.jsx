import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import categoryImg from '../Images/Categories.png'
import categoriesData from '../Images/CategoriesData.json' 

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
          background: rgba(0, 0, 0, 0.55);
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

        /* Dynamic Grid Layout Styles */
        .categories-grid-section {
          background-color: #0f172a; 
          padding: 80px 0 40px 0; 
        }

        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          background: rgba(255, 255, 255, 0.06) !important;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 20px !important;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
          border-color: #0d6efd !important; 
        }

        .category-icon {
          font-size: 3.5rem;
          margin-bottom: 15px;
          display: inline-block;
        }

        .explore-btn {
          border-radius: 50px !important;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .explore-btn:hover {
          background-color: #0d6efd !important;
          color: #ffffff !important;
        }

        /* FAQ CUSTOM STYLES */
        .faq-section {
          background-color: #0f172a; 
          padding-bottom: 80px;
        }

        .faq-accordion .accordion-item {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .faq-accordion .accordion-button {
          background-color: transparent !important;
          color: #ffffff !important;
          font-weight: 600;
          padding: 20px;
          box-shadow: none !important;
          width: 100%;
          text-align: left;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-accordion .accordion-button:not(.collapsed) {
          color: #0d6efd !important;
        }

        .faq-arrow {
          transition: transform 0.2s ease;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .faq-accordion .accordion-button:not(.collapsed) .faq-arrow {
          transform: rotate(180deg);
          color: #0d6efd;
        }

        .faq-accordion .accordion-body {
          color: #94a3b8 !important; 
          line-height: 1.6;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.15);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Top White Bar + Navbar only */}
      <Header hideHero={true} />

      <div className="categories-hero-wrapper">
        <img
          src={categoryImg}
          alt="Categories Background"
          className="categories-hero-image"
        />
        <div className="categories-hero-overlay"></div>
        <div className="categories-hero-content">
          <div className="categories-left-text">
            <h1>Explore Our Categories</h1>
            <p>Find anything you need — <br />borrow it, use it, return it.</p>
          </div>
          <div className="categories-right-content"></div>
        </div>
      </div>

      {/* Grid mapping from categoriesData.json */}
      <div className="categories-grid-section text-white">
        <div className="container">
          <div className="row g-4">
            {categoriesData.map((category) => (
              <div key={category.id} className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 p-4 text-center category-card text-white">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <span className="category-icon">{category.icon}</span>
                      <h4 className="card-title fw-bold mb-2">{category.title}</h4>
                      <p className="card-text text-secondary small mb-4">{category.description}</p>
                    </div>
                    <div>
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3 d-inline-block fw-semibold">
                        {category.count} Items Listed
                      </span>
                      <button className="btn btn-outline-primary w-100 explore-btn">
                        Explore Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="faq-section text-white">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="text-center mb-5">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
            <p className="text-secondary">Got questions about how borrowing works? We have answers.</p>
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