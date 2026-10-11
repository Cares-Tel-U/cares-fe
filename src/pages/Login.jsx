import React, { useState } from 'react';

const Login = ({ onSwitchToSignUp, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8 || password === 'salah') {
      setLoginError(true);
      return;
    }
    if (email && password) {
      setLoginError(false);
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
        {loginError && (
          <div
            style={{
              backgroundColor: '#f2989b',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '500',
              marginBottom: '16px'
            }}
          >
            Kata sandi yang Anda masukkan tidak valid atau salah. Silakan coba kembali
          </div>
        )}
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