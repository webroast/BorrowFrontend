import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import logo from '../Images/HeaderFooterMainLogo.png'

const Register = ({ onLogin }) => {
  // State for form inputs with "role" defaulted to "ROLE_USER"
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contact: '',
    gender: '',
    role: 'ROLE_USER' // Default role added here automatically
  });

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit Handler for User Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // POST request sending user JSON object to backend including role
      const response = await axios.post("http://localhost:8080/users/add", formData);
      console.log("User Registered Successfully:", response.data);

      const registeredUser = response.data;

      // Save user details to LocalStorage for session persistence
      localStorage.setItem("user", JSON.stringify({
        id: registeredUser.id,
        role: registeredUser.role || 'ROLE_USER',
        user: registeredUser
      }));

      // Call optional parent handler if provided
      if (onLogin) {
        onLogin(registeredUser);
      }

      alert("Registration Successful!");

      // Automatic redirect to User Dashboard
      navigate("/login");

    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response && error.response.data) {
        setErrorMsg(typeof error.response.data === 'string' ? error.response.data : 'Registration failed.');
      } else {
        setErrorMsg('Server error. Please check your backend connection.');
      }
    }
  };

  return (
    <>
      <style>{`
        .register-hero-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
        }
        .register-hero-image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0; left: 0;
          object-fit: cover;
          filter: grayscale(30%);
        }
        .register-hero-overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.60);
          z-index: 1;
        }
        .register-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 60px;
          min-height: 100vh;
          gap: 40px;
        }
        .register-left-text { flex: 1; color: #fff; padding-right: 20px; }
        .register-left-text h1 { font-size: 3rem; font-weight: 800; line-height: 1.2; text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }
        .register-left-text p { font-size: 1.2rem; margin-top: 15px; color: #e2e8f0; line-height: 1.7; }
        .register-left-text .highlight { color: #60a5fa; font-weight: 700; }
        .register-right-form { flex: 1.2; display: flex; justify-content: center; align-items: center; }
        
        .register-formcontainer {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 40px 48px;
          width: 100%;
          max-width: 700px;
        }
        
        .register-specs { height: 45px; width: auto; margin-bottom: 12px; }
        .register-heading { font-size: 1.8rem; color: #fff; margin-bottom: 5px; font-weight: 300; }
        .register-subtext { color: rgba(255,255,255,0.55); font-size: 0.85rem; margin-bottom: 20px; }
        
        .register-google-btn {
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .register-google-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }
        .register-google-btn:active { transform: scale(0.98); }
        .register-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .register-divider hr { flex: 1; border-color: rgba(255,255,255,0.2); opacity: 1; }
        .register-divider span { color: rgba(255,255,255,0.5); font-size: 0.85rem; white-space: nowrap; }
        
        .register-label { 
          color: #fff; 
          font-size: 0.95rem; 
          font-weight: 700; 
          margin-bottom: 6px; 
          display: block; 
          text-align: center;
        }
        .register-input {
          background: rgba(255,255,255,0.08) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          color: #fff !important;
          border-radius: 10px !important;
          margin-bottom: 16px;
          padding: 12px 16px;
          width: 100%;
        }
        .register-input::placeholder { color: rgba(255,255,255,0.45) !important; }
        .register-input option {
          background: #1e293b;
          color: #fff;
        }
        .register-input:focus { background: rgba(255,255,255,0.15) !important; box-shadow: 0 0 0 2px rgba(99,102,241,0.4) !important; outline: none; }
        .register-whatsapp-check { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; margin-top: 4px; }
        .register-whatsapp-check input { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); width: 16px; height: 16px; }
        .register-whatsapp-check label { color: rgba(255,255,255,0.9); font-size: 0.88rem; margin: 0; }
        .register-whatsapp-check i { color: #25D366; font-size: 1.1rem; }
        .register-submit-btn {
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
        .register-submit-btn:hover { background-color: #0b5ed7; transform: translateY(-2px); }
        .register-login-link { text-align: center; color: rgba(255,255,255,0.6); font-size: 0.88rem; margin: 0; }
        .register-login-link a { color: #93c5fd; text-decoration: none; font-weight: 600; }
        .register-login-link a:hover { text-decoration: underline; }
        .register-error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.4);
          color: #fca5a5;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.88rem;
          margin-bottom: 14px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .register-hero-content { flex-direction: column; padding: 30px 20px; min-height: auto; }
          .register-left-text { padding-right: 0; text-align: center; }
          .register-left-text h1 { font-size: 2rem; }
          .register-left-text p { font-size: 1rem; }
          .register-right-form { width: 100%; }
          .register-formcontainer { padding: 25px 20px; max-width: 100%; }
        }
      `}</style>

      <Header hideHero={true} />

      <div className="register-hero-wrapper">
        <img
          src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=1170&auto=format&fit=crop"
          alt="Register Background"
          className="register-hero-image"
        />
        <div className="register-hero-overlay"></div>

        <div className="register-hero-content">
          <div className="register-left-text">
            <h1>Join the <span className="highlight">Borrrow</span> Community!</h1>
            <p>
              Register today and start borrowing or lending <br />
              items with trusted people around you. <br /><br />
              <span className="highlight">Save money.</span> Reduce waste. <br />
              Live smarter — together.
            </p>
          </div>

          <div className="register-right-form">
            <div className="register-formcontainer mt-5 me-2">
              <img className="register-specs" src={logo} alt="Logo" />
              <h1 className="register-heading">Register Now</h1>
              <p className="register-subtext">Use social login for a faster experience</p>

              {/* Google Register Button */}
              <button className="register-google-btn" type="button">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.9 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.1-4.5 6.7l7 5.4c4-3.8 6.2-9.3 6.2-16.1z"/>
                  <path fill="#FBBC05" d="M10.7 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7-5.4C2.3 16.7 1 20.2 1 24s1.3 7.3 3.7 10.5l7-5.4-.1-.6z"/>
                  <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5l-7-5.4c-1.8 1.2-4.1 2-6.7 2-6.3 0-11.6-4.3-13.3-10.1l-7 5.4C7 41.3 14.8 47 24 47z"/>
                </svg>
                Register with Google
              </button>

              <div className="register-divider">
                <hr />
                <span>or register with details</span>
                <hr />
              </div>

              {/* Display Error Message */}
              {errorMsg && <div className="register-error">{errorMsg}</div>}

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                {/* 1. Full Name */}
                <label className="register-label">Enter Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control register-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                {/* 2. Email */}
                <label className="register-label">Enter Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control register-input"
                  placeholder="johndoe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                {/* 3. Password */}
                <label className="register-label">Enter Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control register-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {/* 4. Contact Number */}
                <label className="register-label">Enter Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  className="form-control register-input"
                  placeholder="Enter 10 digit number"
                  maxLength="10"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />

                {/* 5. Gender Dropdown */}
                <label className="register-label">Select Gender</label>
                <select 
                  name="gender"
                  className="form-select register-input" 
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {/* WhatsApp Update Checkbox */}
                <div className="register-whatsapp-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="whatsappUpdates"
                  />
                  <label htmlFor="whatsappUpdates">Get Updates in Whatsapp</label>
                  <i className="fa-brands fa-whatsapp"></i>
                </div>

                <button type="submit" className="register-submit-btn">Create Account</button>
              </form>

              <p className="register-login-link">
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register