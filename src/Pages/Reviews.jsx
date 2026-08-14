import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import reviewimg from '../Images/Reviewsheroimg.png' 

const Reviews = () => {
  // Dynamic Reviews Data Array
  const reviewsData = [
    {
      id: 1,
      name: "Aarav Sharma",
      role: "Photography Enthusiast",
      stars: "⭐⭐⭐⭐⭐",
      text: "Renting a Sony A7 IV for a weekend road trip was completely hassle-free. The lender was super cooperative and the gear was in pristine condition. Saved me thousands!"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "DIY Hobbyist",
      stars: "⭐⭐⭐⭐⭐",
      text: "Needed a heavy-duty drill for a one-day home renovation project. Found one just 2 km away in 10 minutes. This platform is an absolute game-changer!"
    },
    {
      id: 3,
      name: "Rohan Verma",
      role: "Camping & Trekking Lover",
      stars: "⭐⭐⭐⭐⭐",
      text: "Borrowed complete camping gear including a 4-person tent and trekking poles. Smooth handoff, reasonable pricing, and easy returns. Highly recommended."
    },
    {
      id: 4,
      name: "Sneha Nair",
      role: "Event Planner",
      stars: "⭐⭐⭐⭐⭐",
      text: "Instead of buying expensive ambient party lights and speakers for a single gig, I rented them here. Everything worked flawlessly and cut down event overheads."
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      role: "Equipment Lender",
      stars: "⭐⭐⭐⭐⭐",
      text: "Listing my idle drone and stabilizer helped me earn steady side income. The verification process gives peace of mind knowing my gear is in responsible hands."
    },
    {
      id: 6,
      name: "Ananya Iyer",
      role: "Student Filmmaker",
      stars: "⭐⭐⭐⭐⭐",
      text: "As a student on a tight budget, renting cinema lenses per day made my graduation project look premium without burning a hole in my pocket."
    }
  ]

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
          height: 70vh;
          display: block;
          filter: grayscale(25%);
          object-fit: cover;
        }

        .reviews-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.40);
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

        /* LIGHT/WHITE THEME MATCHING CATEGORIES & CONTACT */
        .reviews-list-section {
          background-color: #ffffff;
          padding: 80px 0 20px 0;
        }

        .full-width-review-card {
          background: #ffffff !important;
          border: 1.5px solid #bfdbfe !important; /* Soft light-blue border */
          border-radius: 16px !important;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.04);
          transition: all 0.25s ease-in-out;
        }

        .full-width-review-card:hover {
          transform: translateY(-3px);
          border-color: #93c5fd !important;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.08) !important;
        }

        .review-author-name {
          color: #0f172a;
        }

        .review-author-role {
          color: #64748b;
        }

        .review-body-text {
          color: #475569;
          line-height: 1.7;
          font-size: 1.02rem;
        }

        /* Closing CTA Section (White Theme) */
        .reviews-cta-section {
          background-color: #ffffff;
          padding: 40px 0 80px 0;
        }

        .cta-small-text {
          color: #64748b;
          font-size: 0.95rem;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .cta-btn-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
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
          src={reviewimg}
          alt="Customer Reviews Background" 
          className="reviews-hero-image" 
        />
        <div className="reviews-hero-overlay"></div>
        <div className="reviews-hero-content pt-5">
          <h1 className="text-bottom mt-3">Customer Reviews</h1>
        </div>
      </div>

      {/* Dynamic Full-Width Reviews Section (White Theme) */}
      <div className="reviews-list-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="row g-4">
            {reviewsData.map((review) => (
              <div key={review.id} className="col-12">
                <div className="card p-4 full-width-review-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-0 review-author-name">{review.name}</h5>
                        <small className="review-author-role">{review.role}</small>
                      </div>
                      <div className="fs-5">{review.stars}</div>
                    </div>
                    <p className="card-text mb-0 review-body-text">
                      "{review.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Small Closing CTA Section */}
      <div className="reviews-cta-section text-center">
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