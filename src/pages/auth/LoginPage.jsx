import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
import { authService } from '../../services/auth.service';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notificationMsg = location.state?.notificationMessage || '';
  const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('cares_remembered_email') || '' : '';
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(savedEmail));
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getEmailError = () => {
    if (!isSubmitted) return '';
    const trimmed = email.trim();
    if (!trimmed) return 'Alamat email wajib diisi';
    if (!emailRegex.test(trimmed)) return 'Format alamat email tidak valid';
    return '';
  };

  const getPasswordError = () => {
    if (!isSubmitted) return '';
    if (!password) return 'Password wajib diisi';
    return '';
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoginError(false);
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || !password) {
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(trimmedEmail, password, rememberMe);
      const user = data.user;
      const isAdmin = user.role === 'SARPRAS' || user.role === 'ADMIN';

      if (rememberMe) {
        localStorage.setItem('cares_remembered_email', trimmedEmail);
      } else {
        localStorage.removeItem('cares_remembered_email');
      }

      const userPayload = {
        id: user.id,
        email: user.email,
        name: user.nama,
        nama: user.nama,
        nim: user.nim,
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
      {/* Banner Pesan Sukses Pemulihan Password / Redirect */}
      {notificationMsg && !loginError && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: '1.45',
            fontWeight: '500',
            marginBottom: '20px'
          }}
        >
          {notificationMsg}
        </div>
      )}

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

      <form onSubmit={handleSubmit} noValidate>
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
          error={emailError}
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
            error={passwordError}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '-6px',
              marginBottom: '20px'
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '12.5px',
                color: '#4b5563',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '15px',
                  height: '15px',
                  accentColor: '#ba181b',
                  cursor: 'pointer'
                }}
              />
              <span>Ingat saya</span>
            </label>

            <Link
              to="/forgot-password"
              style={{
                fontSize: '12px',
                color: '#ba181b',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '2px 0'
              }}
            >
              Lupa Password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            marginTop: '4px',
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: '8px',
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

      <ReportLoadingModal isOpen={loading} text="Memproses login..." />
    </AuthLayout>
  );
};

export default LoginPage;
