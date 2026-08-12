import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import reviewsBgImg from '../Images/Categories.png' 
// 👇 Make sure this path points to your JSON file location containing the 6 reviews
import reviewsData from '../Images/Reviews.json' 

const Reviews = () => {
  return (
    <>
      <style>{`
        .reviews-hero-wrapper {
          position: relative;
          width: 100%;
          height: auto;
          overflow: hidden;
          background-color: #0f172a;
        }

        .reviews-hero-image {
          width: 100%;
          height: 90vh;
          display: block;
          filter: grayscale(25%);
        }

        .reviews-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.65);
          z-index: 1;
        }

        .reviews-hero-content {
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

        .reviews-hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .reviews-hero-content p {
          font-size: 1.2rem;
          margin-top: 15px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
        }

        .reviews-list-section {
          background-color: #0f172a;
          padding: 60px 0 20px 0; /* Tightened bottom padding for the transition */
        }

        .full-width-review-card {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .full-width-review-card:hover {
          transform: translateY(-2px);
          border-color: #0d6efd !important;
        }

        /* Small Call-to-Action Styling at the bottom */
        .reviews-cta-section {
          background-color: #0f172a;
          padding: 40px 0 60px 0;
        }

        .cta-small-text {
          color: #94a3b8;
          font-size: 0.95rem;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .cta-btn-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .cta-btn-link:hover {
          color: #0a58ca;
          text-decoration: underline;
        }
      `}</style>

      {/* Top White Bar + Navbar only */}
      <Header hideHero={true} />

      {/* Hero Header Section with Background Image */}
      <div className="reviews-hero-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1613963931023-5dc59437c8a6?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Customer Reviews Background" 
          className="reviews-hero-image" 
        />
        <div className="reviews-hero-overlay"></div>
        <div className="reviews-hero-content pt-5">
          <h1 className='text-bottom mt-3'>Customer Reviews</h1>
          <p>See what our community members are saying <br />about their renting and lending experiences.</p>
        </div>
      </div>

      {/* Dynamic Full-Width Reviews Section */}
      <div className="reviews-list-section text-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="row g-4">
            {reviewsData.map((review) => (
              <div key={review.id} className="col-12">
                <div className="card p-4 full-width-review-card text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-0 text-white">{review.name}</h5>
                        <small className="text-secondary">{review.role}</small>
                      </div>
                      <div className="fs-5">{review.stars}</div>
                    </div>
                    <p className="card-text lh-base mb-0" style={{ fontSize: '1.05rem', color: '#cbd5e1' }}>
                      "{review.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Added Small Closing CTA Section */}
      <div className="reviews-cta-section text-center text-white">
        <div className="container">
          <div className="cta-small-text">
            Have you borrowed or lent gear through our platform recently? We'd love to hear your story. 
            <div className="mt-2">
              <a href="mailto:support@justborrowit.com" className="cta-btn-link">
                Submit Your Review &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Reviews