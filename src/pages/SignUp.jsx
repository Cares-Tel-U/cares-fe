import React, { useState } from 'react';

const SignUp = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isPasswordShort = password.length > 0 && password.length < 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordShort || password.length < 8) return;
    if (nama && nim && email && password) {
      onSignUpSuccess({ name: nama, nim: nim, email: email });
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
            <label>Nomor Induk Mahasiswa/Pegawai</label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nomor induk mahasiswa/pegawai"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
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
              style={{ borderColor: isPasswordShort ? '#ef4444' : undefined }}
            />
            {isPasswordShort ? (
              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>Password kurang dari 8 karakter</div>
            ) : (
              <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Password minimal 8 karakter</div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isPasswordShort}
            style={{
              backgroundColor: isPasswordShort ? '#f2989b' : undefined,
              cursor: isPasswordShort ? 'not-allowed' : 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>
        <div className="auth-footer">
          Sudah punya akun? <span className="auth-link" onClick={onSwitchToLogin}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;