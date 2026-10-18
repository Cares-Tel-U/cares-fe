import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/auth.service';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('ambangawi@telkomuniversity.ac.id');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(false);
    setErrorMessage('');
    setLoading(true);

    try {
      const data = await authService.login(email.trim(), password);
      const user = data.user;
      const isAdmin = user.role === 'SARPRAS' || user.role === 'ADMIN';

      const userPayload = {
        id: user.id,
        email: user.email,
        name: user.nama,
        nama: user.nama,
        role: isAdmin ? 'Admin' : 'Mahasiswa',
        rawRole: user.role,
        avatar: user.avatar,
        notificationPreference: user.notificationPreference,
      };

      if (onLoginSuccess) {
        onLoginSuccess(userPayload);
      }

      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoginError(true);
      setErrorMessage(err.message || 'Email atau kata sandi tidak valid. Silakan coba kembali.');
    } finally {
      setLoading(false);
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
          {errorMessage || 'Kata sandi yang Anda masukkan tidak valid atau salah. Silakan coba kembali'}
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
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            marginTop: '4px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Memproses...' : 'Login'}
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
