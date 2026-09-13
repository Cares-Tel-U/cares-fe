import React, { useState } from 'react';

const SignUp = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nama && email && password) {
      onSignUpSuccess({ name: nama, email: email });
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
        <div className="auth-form-title">Sign Up</div>
        <div className="auth-form-subtitle">Daftarkan akun untuk mulai melaporkan masalah fasilitas kampus.</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <div className="auth-footer">
          Sudah punya akun? <span className="auth-link" onClick={onSwitchToLogin}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;