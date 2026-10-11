import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('ambangawi@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cek akun yang disimpan dari RegisterPage
    let savedUser = null;
    try {
      const stored = localStorage.getItem('cares_registered_user');
      if (stored) savedUser = JSON.parse(stored);
    } catch (err) {
      console.error(err);
    }

    // Simulasi validasi password:
    // Password benar jika cocok dengan user yang baru register ATAU default demo 'password123' (atau password >= 8 jika tidak sengaja dibuat salah)
    const isSavedUser = savedUser && savedUser.email?.toLowerCase() === email?.toLowerCase();
    const isCorrectPassword = isSavedUser
      ? password === savedUser.password
      : password === 'password123' || (password.length >= 8 && password !== 'salah' && password !== '12345678');

    // Jika kata sandi salah / tidak valid (< 8 atau bernilai salah)
    if (!isCorrectPassword || password.length < 8) {
      setLoginError(true);
      return;
    }

    // Login berhasil
    setLoginError(false);

    if (email.includes('admin')) {
      if (onLoginSuccess) {
        onLoginSuccess({
          email,
          name: 'Admin Cares',
          role: 'Admin'
        });
      }
      navigate('/admin/dashboard');
    } else {
      if (onLoginSuccess) {
        onLoginSuccess({
          email,
          name: savedUser?.name || 'Amba Ngawi',
          role: 'Mahasiswa',
          nim: savedUser?.nim || '103012400229'
        });
      }
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Masuk ke akun CARES untuk membuat laporan dan melihat riwayat laporan fasilitas kampus Anda"
    >
      {/* Banner Pesan Error Login Gagal */}
      {loginError && (
        <div
          style={{
            backgroundColor: '#f2989b',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '12.5px',
            lineHeight: '1.45',
            fontWeight: '500',
            marginBottom: '20px'
          }}
        >
          Kata sandi yang Anda masukkan tidak valid atau salah. Silakan coba kembali
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="Masukkan alamat email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (loginError) setLoginError(false);
          }}
        />

        <div style={{ position: 'relative' }}>
          <Input
            label="Password"
            type="password"
            required
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (loginError) setLoginError(false);
            }}
          />

          <div
            style={{
              textAlign: 'right',
              marginTop: '-10px',
              marginBottom: '18px'
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: '#6b7280',
                cursor: 'pointer'
              }}
              onClick={() => alert('Fitur lupa password dapat menghubungi admin kampus.')}
            >
              Lupa Password?
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{
            width: '100%',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            marginTop: '4px'
          }}
        >
          Login
        </Button>
      </form>

      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13.5px',
          color: '#6b7280'
        }}
      >
        Belum punya akun?{' '}
        <Link
          to="/register"
          style={{
            color: '#ba181b',
            textDecoration: 'none',
            fontWeight: '700'
          }}
        >
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
