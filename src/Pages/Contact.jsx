import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import contactBgImg from '../Images/Contactus.png'

const Contact = () => {
  // Dynamic Contact Data Array
  const contactInfo = [
    {
      id: 1,
      iconClass: 'fa-solid fa-phone',
      title: 'Call or WhatsApp',
      description: 'Reach us directly for swift platform support and order queries.',
      actionText: '+91 8942 00 8221',
      link: 'tel:+918942008221',
      badge: 'Available 9 AM - 8 PM'
    },
    {
      id: 2,
      iconClass: 'fa-solid fa-envelope',
      title: 'Email Support',
      description: 'Send us your inquiries, feedback, or listing assistance requests anytime.',
      actionText: 'support@justborrowit.com',
      link: 'mailto:support@justborrowit.com',
      badge: '24/7 Response'
    },
    {
      id: 3,
      iconClass: 'fa-brands fa-instagram',
      title: 'Instagram DM',
      description: 'Follow our updates or drop us a message anytime on social media.',
      actionText: '@justborrrowit',
      link: 'https://instagram.com/justborrrowit',
      badge: 'Social Support'
    }
  ]

  return (
    <>
      <style>{`
        .contact-hero-wrapper {
          position: relative;
          width: 100%;
          height: 70vh;
          overflow: hidden;
        }

        .contact-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        .contact-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
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

        /* LIGHT/WHITE THEME MATCHING CATEGORIES */
        .contact-info-section {
          background-color: #ffffff;
          padding: 80px 0;
        }

        .contact-card {
          background: #ffffff !important;
          border: 1.5px solid #bfdbfe !important; /* Soft light-blue border */
          border-radius: 16px !important;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.04);
          transition: all 0.25s ease-in-out;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          border-color: #93c5fd !important;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.1) !important;
        }

        .contact-icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          border: 1px solid #dbeafe;
          transition: transform 0.2s ease;
        }

        .contact-card:hover .contact-icon-wrapper {
          transform: scale(1.08);
          background-color: #dbeafe;
        }

        .contact-icon {
          font-size: 2rem;
          color: #0d6efd;
        }

        .contact-card-title {
          color: #0f172a;
        }

        .contact-card-text {
          color: #64748b;
          line-height: 1.6;
        }

        .contact-link {
          display: inline-block;
          padding: 10px 24px;
          background-color: #eff6ff;
          color: #0d6efd;
          border: 1px solid #bfdbfe;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .contact-link:hover {
          background-color: #0d6efd;
          color: #ffffff;
          border-color: #0d6efd;
        }
      `}</style>

      {/* Top White Bar + Navbar only */}
      <Header hideHero={true} />

      {/* Hero Header Section */}
      <div className="contact-hero-wrapper">
        <img 
          src={contactBgImg}
          alt="Contact Us Background" 
          className="contact-hero-image" 
        />
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Contact Our Team</h1>
        </div>
      </div>

      {/* Dynamic Contact Cards Section (White Theme) */}
      <div className="contact-info-section">
        <div className="container">
          <div className="row g-4 justify-content-center">
            
            {contactInfo.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 p-4 text-center contact-card">
                  <div className="card-body d-flex flex-column justify-content-between align-items-center">
                    
                    <div>
                      {/* Dynamic Icon */}
                      <div className="contact-icon-wrapper">
                        <i className={`${item.iconClass} contact-icon`}></i>
                      </div>

                      <h4 className="card-title fw-bold mb-2 contact-card-title">{item.title}</h4>
                      <p className="card-text small mb-4 contact-card-text">{item.description}</p>
                    </div>

                    <div>
                      <a 
                        href={item.link} 
                        target={item.link.startsWith('http') ? '_blank' : '_self'} 
                        rel="noreferrer" 
                        className="contact-link"
                      >
                        {item.actionText}
                      </a>
                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Contact