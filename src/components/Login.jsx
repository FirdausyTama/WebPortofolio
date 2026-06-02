import React, { useState } from 'react';
import './Login.css';
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'atama2026';

    if (password === correctPassword) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onLoginSuccess();
    } else {
      setError(true);
      setIsShaking(true);
      // Trigger wobble shake animation
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="login-page-container">
      {/* Background decoration blur lights */}
      <div className="login-bg-glow glow-1"></div>
      <div className="login-bg-glow glow-2"></div>

      <div className={`login-card glass ${isShaking ? 'shake' : ''}`}>
        <button className="login-back-btn" onClick={() => window.location.hash = '#'}>
          <FaArrowLeft /> Kembali
        </button>

        <div className="login-header">
          <div className="login-logo-circle">
            <FaLock className="login-logo-icon" />
          </div>
          <h2>Admin Access</h2>
          <p>Masukkan kata sandi administrator untuk mengelola konten</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Kata Sandi Admin"
              required
              className={`login-input ${error ? 'input-error' : ''}`}
            />
            <button
              type="button"
              className="login-toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <div className="login-error-message">
              Kata sandi tidak cocok. Silakan coba lagi!
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
