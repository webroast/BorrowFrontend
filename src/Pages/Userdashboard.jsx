import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Component/Header'

const Userdashboard = () => {
  const navigate = useNavigate();

  // Logout handler clears stored user session and redirects to Login
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <>
      <style>
        {`
        .contact-hero-wrapper {
          position: relative;
          width: 100%;
          height: 55vh;
          overflow: hidden;
          background-color: #0f172a;
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
          background: rgba(0, 0, 0, 0.50);
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
          font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
          font-size: 3rem;
          font-weight: 200;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }

        .contact-hero-content p {
          font-family: monospace;
          font-size: 1.2rem;
          margin-top: 15px;
          color: #e2e8f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
        }

        .contact-info-section {
          background-color: #0f172a;
          padding: 80px 0;
        }
        `}
      </style>

      {/* Top White Bar + Navbar with Logout Capsule */}
      <Header hideHero={true} isLoggedIn={true} onLogout={handleLogout} />

      {/* Hero Header Section with Background Image */}
      <div className="contact-hero-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1640969178204-261969c1305c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Contact Us Background" 
          className="contact-hero-image" 
        />
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Welcome To User Dashboard</h1>
          <p>"Here is an overview of your recent activity and open tasks." <br />"Here is a quick snapshot of your account activity."</p>
        </div>
      </div>
      
      <div className="container py-5 text-center">
        <h2>Welcome to your personal portal!</h2>
      </div>
    </>
  )
}

export default Userdashboard