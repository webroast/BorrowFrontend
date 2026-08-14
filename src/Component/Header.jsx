import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import '../CSS/Header.css'
import logovideo from '../Images/Scene.mp4'
import loginimg from '../Images/login.png'
import HFlogo from '../Images/HeaderFooterMainLogo.png'

const Header = ({ 
  videoSrc, 
  imageSrc, 
  heroTitle, 
  heroSubtitle, 
  heroBtnText, 
  heroBtnLink, 
  hideHero, 
  isLoggedIn, 
  onLogout,
  cartCount = 0 // Optional prop to pass dynamic cart item count
}) => {
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 90);
  const navigate = useNavigate();

  // Check if user session exists in localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userIsLoggedIn = isLoggedIn || !!user;

  // Handle Logout action
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // ── Scroll Listener for Transparent / Sticky Nav ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 90);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>
        {`
          /* ── HERO ── */
          .hero-wrapper { position: relative; width: 100%; }
          .hero-container { position: relative; width: 100%; height: 75vh; overflow: hidden; background-color: #000; }
          .hero-video { width: 100%; height: 100%; filter: grayscale(40%); object-fit: cover; }
          .hero-image { width: 100%; height: 100%; object-fit: cover; filter: grayscale(40%); }
          .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1; }
          .hero-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: #fff; z-index: 2; width: 90%; }

          /* ── NAV ── */
          .transparent-nav {
            background-color: transparent !important;
            position: absolute; top: 0; left: 0;
            width: 100%; z-index: 10;
            transition: all 0.3s ease;
            padding: 15px;
          }
          .transparent-nav .header-links { color: #fff !important; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }
          .transparent-nav .header-links i, 
          .transparent-nav .header-links svg { color: #fff !important; }
          .solid-sticky-nav {
            position: fixed; top: 0; left: 0;
            width: 100%; z-index: 1050;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            animation: slideDown 0.3s ease-in-out;
          }
          @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

          /* ── CART ICON & BADGE ── */
          .cart-nav-link {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: transform 0.2s ease;
          }
          .cart-nav-link:hover {
            transform: scale(1.08);
          }
          .cart-badge {
            position: absolute;
            top: -7px;
            right: -10px;
            background-color: #0d6efd;
            color: #ffffff;
            font-size: 0.72rem;
            font-weight: 700;
            min-width: 18px;
            height: 18px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            border: 2px solid #ffffff;
            line-height: 1;
            box-shadow: 0 2px 6px rgba(13, 110, 253, 0.4);
            pointer-events: none;
          }

          /* ── TOOLTIP STYLING ── */
          .cart-tooltip {
            position: relative;
          }
          .cart-tooltip::after {
            content: attr(data-tooltip);
            position: absolute;
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            background-color: rgba(15, 23, 42, 0.9);
            color: #ffffff;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 6px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1100;
          }
          /* Tooltip small arrow */
          .cart-tooltip::before {
            content: '';
            position: absolute;
            top: calc(100% + 4px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            border-width: 0 5px 6px 5px;
            border-style: solid;
            border-color: transparent transparent rgba(15, 23, 42, 0.9) transparent;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 1100;
          }
          .cart-tooltip:hover::after,
          .cart-tooltip:hover::before {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
          }

          /* ── LOGOUT CAPSULE BUTTON ── */
          .logout-pill-btn {
            background-color: #dc3545;
            color: #ffffff !important;
            border: none;
            border-radius: 50px;
            padding: 6px 18px;
            font-weight: 600;
            font-size: 0.88rem;
            transition: all 0.3s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 3px 10px rgba(220, 53, 69, 0.25);
          }
          .logout-pill-btn:hover {
            background-color: #bb2d3b;
            transform: translateY(-2px);
            box-shadow: 0 5px 14px rgba(220, 53, 69, 0.35);
          }

          /* ── TOPBAR MOBILE ── */
          @media (max-width: 768px) {
            .topbar-inner {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 6px;
              padding: 10px 15px;
            }
            .topbar-logo-video {
              width: 180px !important;
              height: 50px !important;
            }
            .topbar-nav-items {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 4px;
              margin: 0 !important;
              padding: 0 !important;
            }
            .hero-container { height: 50vh; }
            .hero-title { font-size: 1.5rem !important; }
            .hero-subtitle { font-size: 1rem !important; }
          }
        `}
      </style>

      {/* Top Bar */}
      <div className="container-fluid navbar navbar-light mb-0 pb-0 bg-white">
        <div className="container-fluid topbar-inner d-flex justify-content-between align-items-center">

          {/* Logo video */}
          <Link to="/" className="navbar-brand p-0">
            <div className="topbar-logo-video" style={{ width: '400px', height: '80px', overflow: 'hidden', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
              <video autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.25)' }}>
                <source src={logovideo} type="video/mp4" />
              </video>
            </div>
          </Link>

          <ul className="navbar-nav topbar-nav-items d-flex flex-row align-items-center gap-3">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fa-solid fa-phone logos1"></i>{' '}
                <i className="fa-brands fa-whatsapp logos"></i>
                <span className="number fw-bold"> +91 8942 00 8221</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fa-brands fa-instagram logos"></i>
                <span className="insta-id fw-bold"> justborrrowit</span>
              </a>
            </li>

            {/* Login Icon OR Logout Capsule Button */}
            <li className="d-flex align-items-center">
              {userIsLoggedIn ? (
                <button 
                  type="button" 
                  className="logout-pill-btn" 
                  onClick={handleLogoutClick}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              ) : (
                <Link className='header-links' to="/login">
                  <img className='login-img' src={loginimg} alt="Login" />
                </Link>
              )}
            </li>
          </ul>

        </div>
      </div>

      <div className="hero-wrapper">

        {/* Navbar — toggles between transparent-nav and solid-sticky-nav bg-light on scroll */}
        <nav className={`container-fluid Navbar d-flex justify-content-between align-items-center ${isScrolled ? 'solid-sticky-nav bg-light' : 'transparent-nav'}`}>
          <div>
            <Link to="/">
              <img className='Navlogo' style={{ height: '60px', width: 'auto', objectFit: 'contain' }} src={HFlogo} alt="NavLogo" />
            </Link>
          </div>

          <ul className='nav-list desktop-nav-links mb-0 d-flex align-items-center'>
            <li><Link className='header-links' to="/">Home</Link></li>
            <li><Link className='header-links' to="/about">About Us</Link></li>
            <li><Link className='header-links' to="/categories">Categories</Link></li>
            <li>
              <Link className='header-links custom-tooltip-link' to="/howitworks" data-tooltip="How It Works">
                <i className="fa-solid fa-gear gear-one"></i>
                <i className="fa-solid fa-gear gear-two"></i>
              </Link>
            </li>
            <li><Link className='header-links' to="/contactus">Contact Us</Link></li>
            <li><Link className='header-links' to="/reviews">Reviews</Link></li>
            
            {/* WishList Link */}
            <li>
              <Link className='header-links' to="/wishlist">
                <span>WishList </span>
                <i className="fa-solid fa-heart" style={{ color: '#e11d48' }}></i>
              </Link>
            </li>

            {/* Cart Icon with Dynamic Badge & Tooltip */}
            <li>
              <Link 
                className='header-links cart-nav-link cart-tooltip me-4' 
                to="/cart" 
                data-tooltip="View Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} strokeWidth={2.2} />
                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Hero Section */}
        {!hideHero && (
          <section className="hero-container">
            {imageSrc ? (
              <img src={imageSrc} alt="Hero" className="hero-image" />
            ) : (
              <video autoPlay loop muted playsInline className="hero-video" key={videoSrc}>
                <source src={videoSrc} type="video/mp4" />
              </video>
            )}
            <div className="hero-overlay"></div>
            <div className="hero-content text-center">
              <h1 className="hero-title fw-bold">{heroTitle}</h1>
              <h4 className="hero-subtitle fw-bold">{heroSubtitle}</h4>
              {heroBtnText && (
                <Link to={heroBtnLink} className="btn text-white custom-hero-btn mt-3">
                  {heroBtnText}
                </Link>
              )}
            </div>
          </section>
        )}

      </div>
    </>
  )
}

export default Header