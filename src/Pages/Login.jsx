import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import forgotpassword from './Forgotpassword';
import logo from '../Images/HeaderFooterMainLogo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate user
      const response = await axios.post(
        "http://localhost:8080/users/login",
        null,
        {
          params: {
            email: email,
            password: password
          }
        }
      );

      const userData = response.data;
      const userId = userData.id || userData.userId;

      // 2. Store normalized user data
      const userPayload = {
        id: userId,
        email: userData.email,
        username: userData.username || userData.name || 'User',
        role: userData.role,
        ...userData
      };

      localStorage.setItem("user", JSON.stringify(userPayload));

      // 3. Fetch user's persistent cart from the database
      if (userId) {
        try {
          const cartResponse = await axios.get(`http://localhost:8080/api/cart/cartitem/${userId}`);
          if (Array.isArray(cartResponse.data)) {
            const dbCart = cartResponse.data.map((item) => {
              const prod = item.product || item.hardware || item.medicines || item.item || item;
              return {
                cartId: item.id,
                productId: prod.id || prod.productId || item.productId,
                name: prod.productName || prod.hardwareName || prod.itemName || prod.MedicineName || prod.name || 'Rental Item',
                price: Number(prod.price ?? prod.Price ?? prod.perDayPrice ?? 0),
                image: prod.image || prod.img,
                quantity: Number(item.quantity) || 1
              };
            });

            localStorage.setItem('cart', JSON.stringify(dbCart));
          }
        } catch (cartErr) {
          console.warn("Could not sync persistent cart on login:", cartErr);
        }
      }

      // 4. Trigger UI event to update Navbar/Badges
      window.dispatchEvent(new Event('storage'));

      // 5. Navigate based on role
      if (userData.role === "ROLE_ADMIN") {
        alert("Welcome Back...! Admin...");
        navigate("/admindashboard");
      } else {
        alert(`Welcome Back...! ${userData.username || 'User'}`);
        navigate("/userdashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        alert(typeof error.response.data === 'string' ? error.response.data : 'Invalid email or password.');
      } else {
        alert("Server Error. Please check if your backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-hero-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
        }
        .login-hero-image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0; 
          left: 0;
          object-fit: cover;
          filter: grayscale(30%);
        }
        .login-hero-overlay {
          position: absolute;
          top: 0; 
          left: 0;
          width: 100%; 
          height: 100%;
          background: rgba(0, 0, 0, 0.60);
          z-index: 1;
        }
        .login-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 60px;
          min-height: 100vh;
          gap: 40px;
        }
        .login-left-text { 
          flex: 1; 
          color: #fff; 
          padding-right: 20px; 
        }
        .login-left-text h1 { 
          font-size: 3rem; 
          font-weight: 800; 
          line-height: 1.2; 
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5); 
        }
        .login-left-text p { 
          font-size: 1.2rem; 
          margin-top: 15px; 
          color: #e2e8f0; 
          line-height: 1.7; 
        }
        .login-left-text .highlight { 
          color: #60a5fa; 
          font-weight: 700; 
        }
        .login-right-form { 
          flex: 1.2; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
        }
        
        .login-formcontainer {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 40px 48px;
          width: 100%;
          max-width: 500px;
        }
        
        .login-specs { 
          height: 45px; 
          width: auto; 
          margin-bottom: 12px; 
        }
        .login-heading { 
          font-size: 1.8rem; 
          color: #fff; 
          margin-bottom: 5px; 
          font-weight: 300; 
        }
        .login-subtext { 
          color: rgba(255, 255, 255, 0.55); 
          font-size: 0.85rem; 
          margin-bottom: 20px; 
        }
        
        .login-google-btn {
          background: #fff;
          border: none;
          color: #333;
          border-radius: 10px;
          padding: 11px;
          width: 100%;
          font-weight: 700;
          font-size: 0.95rem;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 18px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .login-google-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        }
        .login-divider { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          margin-bottom: 18px; 
        }
        .login-divider hr { 
          flex: 1; 
          border-color: rgba(255, 255, 255, 0.2); 
          opacity: 1; 
        }
        .login-divider span { 
          color: rgba(255, 255, 255, 0.5); 
          font-size: 0.85rem; 
          white-space: nowrap; 
        }
        
        .login-label { 
          color: #fff; 
          font-size: 0.95rem; 
          font-weight: 700; 
          margin-bottom: 6px; 
          display: block; 
          text-align: left;
        }
        .login-input {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: #fff !important;
          border-radius: 10px !important;
          margin-bottom: 16px;
          padding: 12px 16px;
          width: 100%;
        }
        .login-input::placeholder { 
          color: rgba(255, 255, 255, 0.45) !important; 
        }
        .login-submit-btn {
          width: 100%;
          border-radius: 50px;
          padding: 12px;
          font-size: 1rem;
          font-weight: 700;
          background-color: #0d6efd;
          border: none;
          color: #fff;
          transition: background 0.3s ease, transform 0.2s ease;
          margin-bottom: 15px;
          cursor: pointer;
        }
        .login-submit-btn:hover { 
          background-color: #0b5ed7; 
          transform: translateY(-2px); 
        }
        .login-submit-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        .login-register-link { 
          text-align: center; 
          color: rgba(255, 255, 255, 0.6); 
          font-size: 0.88rem; 
          margin-bottom: 8px; 
        }
        .login-register-link a { 
          color: #93c5fd; 
          text-decoration: none; 
          font-weight: 600; 
        }
        .login-register-link a:hover { 
          text-decoration: underline; 
        }
        .login-forgot-link {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.88rem;
          margin: 0;
        }
        .login-forgot-link a {
          color: #93c5fd;
          text-decoration: none;
          font-weight: 600;
        }
        .login-forgot-link a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .login-hero-content { 
            flex-direction: column; 
            padding: 30px 20px; 
            min-height: auto; 
          }
          .login-left-text { 
            padding-right: 0; 
            text-align: center; 
          }
          .login-left-text h1 { font-size: 2rem; }
          .login-left-text p { font-size: 1rem; }
          .login-right-form { width: 100%; }
          .login-formcontainer { 
            padding: 25px 20px; 
            max-width: 100%; 
          }
        }
      `}</style>

      {/* Top Header */}
      <Header hideHero={true} />

      <div className="login-hero-wrapper">
        <img
          src="https://shorturl.at/CIlbS"
          alt="Login Background"
          className="login-hero-image"
        />
        <div className="login-hero-overlay"></div>

        <div className="login-hero-content">
          <div className="login-left-text">
            <h1>Welcome Back to <span className="highlight">Borrrow</span></h1>
            <p>
              Log in to access your saved listings, track active rentals, <br />
              or connect with community lenders.
            </p>
          </div>

          <div className="login-right-form">
            <div className="login-formcontainer mt-5 me-2">
              <img className="login-specs" src={logo} alt="Logo" />
              <h1 className="login-heading">Log In</h1>
              <p className="login-subtext">Access your account to continue</p>

              {/* Google Login Button */}
              <button className="login-google-btn" type="button">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.9 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.1-4.5 6.7l7 5.4c4-3.8 6.2-9.3 6.2-16.1z"/>
                  <path fill="#FBBC05" d="M10.7 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7-5.4C2.3 16.7 1 20.2 1 24s1.3 7.3 3.7 10.5l7-5.4-.1-.6z"/>
                  <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5l-7-5.4c-1.8 1.2-4.1 2-6.7 2-6.3 0-11.6-4.3-13.3-10.1l-7 5.4C7 41.3 14.8 47 24 47z"/>
                </svg>
                Log In with Google
              </button>

              <div className="login-divider">
                <hr />
                <span>or log in with details</span>
                <hr />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <label className="login-label">Email or Phone Number</label>
                <input
                  type="text"
                  className="form-control login-input"
                  placeholder="Enter email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className="login-label d-flex justify-content-between">Password<Link to="/forgotpassword">Reset Password</Link></label>
                <input
                  type="password"
                  className="form-control login-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button 
                  type="submit" 
                  className="login-submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </form>

              <p className="login-register-link">
                Don't have an account? <Link to="/register">Register Now</Link>
              </p>

              
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;