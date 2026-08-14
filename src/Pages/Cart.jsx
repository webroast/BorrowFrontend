import React from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { ChevronDown } from 'lucide-react'
import cartimg from '../Images/CartBackground.png'

const Cart = () => {
  // Smooth scroll handler to the cart section
  const handleScrollDown = () => {
    const cartSection = document.getElementById('cart-items-section');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .cart-hero-wrapper {
          position: relative;
          width: 100%;
          height: 82vh;
          overflow: hidden;
        }

        .cart-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%);
        }

        .cart-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.40);
          z-index: 1;
        }

        .cart-hero-content {
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

        .cart-hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
        }

        /* ── DOWNWARD SCROLL ARROW BUTTON ── */
        .scroll-down-btn {
          margin-top: 24px;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(6px);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: gentleBounce 2s infinite;
        }

        .scroll-down-btn:hover {
          background-color: #0d6efd;
          border-color: #0d6efd;
          transform: translateY(4px);
          box-shadow: 0 0 16px rgba(13, 110, 253, 0.6);
          animation: none;
        }

        @keyframes gentleBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(8px);
          }
          60% {
            transform: translateY(4px);
          }
        }

        .cart-main-section {
          background-color: #ffffff;
          padding: 80px 0;
          min-height: 40vh;
        }
      `}</style>

      {/* Top Header */}
      <Header hideHero={true} />

      {/* Hero Header Section */}
      <div className="cart-hero-wrapper">
        <img 
          src={cartimg} 
          alt="Cart Background" 
          className="cart-hero-image" 
        />
        <div className="cart-hero-overlay"></div>
        <div className="cart-hero-content">
          <h1>Click Arrow To See Your Cart</h1>

          {/* Downward Scroll Arrow */}
          <button 
            className="scroll-down-btn" 
            onClick={handleScrollDown}
            aria-label="Scroll to Cart Items"
            title="Scroll to Cart Items"
          >
            <ChevronDown size={28} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Cart Content Section */}
      <div className="cart-main-section" id="cart-items-section">
        <div className="container">
          {/* Cart items list / empty cart state will go here */}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Cart