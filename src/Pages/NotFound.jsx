import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <style>{`
        .notfound-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 40px 20px;
        }

        .notfound-404 {
          font-size: 10rem;
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 3px #0d6efd;
          line-height: 1;
          letter-spacing: 10px;
          animation: pulse404 2s ease-in-out infinite;
        }

        @keyframes pulse404 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .notfound-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 10px;
          margin-bottom: 15px;
        }

        .notfound-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 420px;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .notfound-btn {
          background-color: #0d6efd;
          color: #ffffff;
          font-weight: 700;
          padding: 14px 45px;
          font-size: 1.05rem;
          border-radius: 50px;
          text-decoration: none;
          transition: background 0.3s ease, transform 0.2s ease;
          box-shadow: 0 4px 20px rgba(13, 110, 253, 0.4);
          display: inline-block;
        }

        .notfound-btn:hover {
          background-color: #0b5ed7;
          color: #ffffff;
          transform: translateY(-3px);
        }

        .notfound-icon {
          font-size: 4rem;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="notfound-wrapper">

        {/* Sad Icon */}
        <div className="notfound-icon">😕</div>

        {/* Big 404 */}
        <div className="notfound-404">404</div>

        {/* Title */}
        <h2 className="notfound-title">Oops! Page Not Found</h2>

        {/* Subtitle */}
        <p className="notfound-subtitle">
          Looks like this page went missing — maybe someone borrowed it and didn't return it! 😄
        </p>

        {/* Go Home Button */}
        <Link to="/" className="notfound-btn">
          ← Go Back to Home
        </Link>

      </div>
    </>
  );
};

export default NotFound;