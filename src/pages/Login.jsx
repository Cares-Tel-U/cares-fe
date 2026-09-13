import React, { useState } from 'react';

const Login = ({ onSwitchToSignUp, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLoginSuccess({ name: 'Amba Ngawi', email: email });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-banner">
        <div className="auth-banner-title">Selamat Datang di</div>
        <div className="auth-logo-box">
          <div className="auth-logo-text">Cares</div>
        </div>
        <div className="auth-subtitle">Bersama Menjaga Fasilitas Kampus</div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form-title">Login</div>
        <div className="auth-form-subtitle">Masuk ke akun CARES untuk membuat laporan dan melihat riwayat laporan fasilitas kampus Anda.</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Alamat Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Masukkan alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <div className="auth-footer">
          Belum punya akun? <span className="auth-link" onClick={onSwitchToSignUp}>Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;