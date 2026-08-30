import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import logo from '../Images/HeaderFooterMainLogo.png';

const Forgotpassword = () => {
  const navigate = useNavigate();

  // Step tracker: 1 = Email, 2 = OTP, 3 = New Password
  const [step, setStep] = useState(1);

  // Form values
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Helper to extract clean error message
  const extractError = (err, fallback) => {
    if (err.response && err.response.data) {
      return typeof err.response.data === 'string' ? err.response.data : fallback;
    }
    return 'Server error. Please verify backend connection.';
  };

  // Step 1: Send OTP Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/users/send-otp', null, {
        params: { email: email.trim() }
      });
      setSuccessMessage(typeof response.data === 'string' ? response.data : 'OTP sent successfully to your email.');
      setStep(2);
    } catch (err) {
      setErrorMessage(extractError(err, 'Failed to send OTP. Email address not found.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP Handler
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit verification OTP.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/users/validate-otp', null, {
        params: {
          email: email.trim(),
          otp: otp.trim()
        }
      });
      setSuccessMessage(typeof response.data === 'string' ? response.data : 'OTP verified successfully!');
      setStep(3);
    } catch (err) {
      setErrorMessage(extractError(err, 'Invalid or expired OTP.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill both password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and retry.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/users/reset-password', null, {
        params: {
          email: email.trim(),
          newPassword: newPassword
        }
      });
      alert(typeof response.data === 'string' ? response.data : 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      setErrorMessage(extractError(err, 'Failed to reset password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .forgot-hero-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
        }
        .forgot-hero-image {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0; 
          left: 0;
          object-fit: cover;
          filter: grayscale(30%);
        }
        .forgot-hero-overlay {
          position: absolute;
          top: 0; 
          left: 0;
          width: 100%; 
          height: 100%;
          background: rgba(0, 0, 0, 0.60);
          z-index: 1;
        }
        .forgot-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 60px;
          min-height: 100vh;
          gap: 40px;
        }
        .forgot-left-text { 
          flex: 1; 
          color: #fff; 
          padding-right: 20px; 
        }
        .forgot-left-text h1 { 
          font-size: 3rem; 
          font-weight: 800; 
          line-height: 1.2; 
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5); 
        }
        .forgot-left-text p { 
          font-size: 1.2rem; 
          margin-top: 15px; 
          color: #e2e8f0; 
          line-height: 1.7; 
        }
        .forgot-left-text .highlight { 
          color: #60a5fa; 
          font-weight: 700; 
        }
        .forgot-right-form { 
          flex: 1.2; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
        }
        .forgot-formcontainer {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 40px 48px;
          width: 100%;
          max-width: 500px;
        }
        .forgot-specs { 
          height: 45px; 
          width: auto; 
          margin-bottom: 12px; 
        }
        .forgot-heading { 
          font-size: 1.8rem; 
          color: #fff; 
          margin-bottom: 5px; 
          font-weight: 300; 
        }
        .forgot-subtext { 
          color: rgba(255, 255, 255, 0.55); 
          font-size: 0.85rem; 
          margin-bottom: 20px; 
        }
        .forgot-label { 
          color: #fff; 
          font-size: 0.95rem; 
          font-weight: 700; 
          margin-bottom: 6px; 
          display: block; 
          text-align: left;
        }
        .forgot-input {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: #fff !important;
          border-radius: 10px !important;
          margin-bottom: 16px;
          padding: 12px 16px;
          width: 100%;
        }
        .forgot-input::placeholder { 
          color: rgba(255, 255, 255, 0.45) !important; 
        }
        .forgot-submit-btn {
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
        .forgot-submit-btn:hover { 
          background-color: #0b5ed7; 
          transform: translateY(-2px); 
        }
        .forgot-submit-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          transform: none;
        }
        .forgot-alert-danger {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid #dc3545;
          color: #ff8a8a;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .forgot-alert-success {
          background: rgba(25, 135, 84, 0.2);
          border: 1px solid #198754;
          color: #8ce3a3;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .forgot-step-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .forgot-step-indicator span.active {
          color: #60a5fa;
          font-weight: 700;
        }
        .forgot-back-link {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.88rem;
          margin-top: 10px;
        }
        .forgot-back-link a {
          color: #93c5fd;
          text-decoration: none;
          font-weight: 600;
        }
        .forgot-back-link a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .forgot-hero-content { 
            flex-direction: column; 
            padding: 30px 20px; 
            min-height: auto; 
          }
          .forgot-left-text { 
            padding-right: 0; 
            text-align: center; 
          }
          .forgot-left-text h1 { font-size: 2rem; }
          .forgot-left-text p { font-size: 1rem; }
          .forgot-right-form { width: 100%; }
          .forgot-formcontainer { 
            padding: 25px 20px; 
            max-width: 100%; 
          }
        }
      `}</style>

      {/* Top Header */}
      <Header hideHero={true} />

      <div className="forgot-hero-wrapper">
        <img
          src="https://shorturl.at/CIlbS"
          alt="Forgot Password Background"
          className="forgot-hero-image"
        />
        <div className="forgot-hero-overlay"></div>

        <div className="forgot-hero-content">
          <div className="forgot-left-text">
            <h1>Reset Your Password on <span className="highlight">Borrrow</span></h1>
            <p>
              Verify your identity securely with email OTP verification and regain access to your account.
            </p>
          </div>

          <div className="forgot-right-form">
            <div className="forgot-formcontainer mt-5 me-2">
              <img className="forgot-specs" src={logo} alt="Logo" />
              <h1 className="forgot-heading">Reset Password</h1>
              <p className="forgot-subtext">Follow the steps below to recover your account</p>

              {/* Step indicator */}
              <div className="forgot-step-indicator">
                <span className={step >= 1 ? 'active' : ''}>1. Send OTP</span>
                <span className={step >= 2 ? 'active' : ''}>2. Verify OTP</span>
                <span className={step === 3 ? 'active' : ''}>3. New Password</span>
              </div>

              {/* Status alerts */}
              {errorMessage && <div className="forgot-alert-danger">{errorMessage}</div>}
              {successMessage && <div className="forgot-alert-success">{successMessage}</div>}

              {/* STEP 1: EMAIL */}
              {step === 1 && (
                <form onSubmit={handleSendOtp}>
                  <label className="forgot-label">Registered Email</label>
                  <input
                    type="email"
                    className="form-control forgot-input"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP */}
              {step === 2 && (
                <form onSubmit={handleValidateOtp}>
                  <label className="forgot-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    className="form-control forgot-input"
                    placeholder="Enter OTP from email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? 'Verifying OTP...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-link text-white-50 p-0 mb-3 d-block w-100 text-center text-decoration-none"
                    style={{ fontSize: '0.85rem' }}
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Didn't receive OTP? Resend
                  </button>
                </form>
              )}

              {/* STEP 3: RESET PASSWORD */}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <label className="forgot-label">New Password</label>
                  <input
                    type="password"
                    className="form-control forgot-input"
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                  />

                  <label className="forgot-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control forgot-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />

                  <button type="submit" className="forgot-submit-btn" disabled={loading}>
                    {loading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>
              )}

              <p className="forgot-back-link">
                Remembered your password? <Link to="/login">Back to Log In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Forgotpassword;