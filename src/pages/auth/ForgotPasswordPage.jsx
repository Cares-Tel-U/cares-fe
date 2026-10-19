import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
import { authService } from '../../services/auth.service';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isEmailRegistered, setIsEmailRegistered] = useState(null); // null: belum dicek, true: terdaftar, false: tidak
  const [emailStatusMessage, setEmailStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const checkTimeoutRef = useRef(null);

  // Debounce pengecekan email ke database saat pengguna mengetik email
  useEffect(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    const trimmed = email.trim();
    if (!trimmed) {
      setIsEmailRegistered(null);
      setEmailStatusMessage('');
      setCheckingEmail(false);
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setIsEmailRegistered(null);
      setEmailStatusMessage('');
      setCheckingEmail(false);
      return;
    }

    setCheckingEmail(true);
    setEmailStatusMessage('Memeriksa ketersediaan email...');

    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await authService.checkEmail(trimmed);
        if (res?.data?.exists) {
          setIsEmailRegistered(true);
          setEmailStatusMessage('Alamat email terdaftar dalam sistem.');
        } else {
          setIsEmailRegistered(false);
          setEmailStatusMessage('Alamat email tidak terdaftar dalam sistem CARES.');
        }
      } catch (err) {
        setIsEmailRegistered(false);
        setEmailStatusMessage(err.message || 'Alamat email tidak terdaftar dalam sistem CARES.');
      } finally {
        setCheckingEmail(false);
      }
    }, 450);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const trimmed = email.trim();
    if (!trimmed || !emailRegex.test(trimmed)) {
      setGeneralError('Format alamat email tidak valid.');
      return;
    }

    if (isEmailRegistered !== true) {
      setGeneralError('Alamat email harus terdaftar di sistem sebelum mengirim instruksi pemulihan.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.forgotPassword(trimmed);
      setSuccessMessage(res.message || 'Instruksi pemulihan kata sandi telah dikirim ke email Anda.');

      // Alihkan ke halaman login setelah instruksi berhasil dikirim
      setTimeout(() => {
        navigate('/login', {
          state: {
            notificationMessage: 'Tautan pemulihan kata sandi telah dikirim ke email terdaftar Anda. Silakan periksa kotak masuk atau spam.',
          },
        });
      }, 1600);
    } catch (err) {
      setGeneralError(err.message || 'Gagal memproses permintaan pemulihan kata sandi. Silakan coba kembali.');
      setLoading(false);
    }
  };

  const isButtonDisabled = !email.trim() || checkingEmail || isEmailRegistered !== true || loading;

  return (
    <AuthLayout
      title=""
      subtitle=""
    >
      {/* Tautan Kembali ke Halaman Login */}
      <div style={{ marginBottom: '28px' }}>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: '600',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ba181b')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Halaman Login
        </Link>
      </div>

      <h2
        style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}
      >
        Lupa Kata Sandi?
      </h2>

      <p
        style={{
          fontSize: '13.5px',
          color: '#6b7280',
          marginBottom: '26px',
          lineHeight: '1.5'
        }}
      >
        Masukkan alamat email yang terdaftar. Kami akan mengirim tautan untuk mengatur ulang kata sandi Anda.
      </p>

      {/* Banner Pesan Sukses */}
      {successMessage && (
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
          {successMessage}
        </div>
      )}

      {/* Banner Pesan Error */}
      {generalError && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '12.5px',
            lineHeight: '1.45',
            fontWeight: '500',
            marginBottom: '20px'
          }}
        >
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <Input
            label="Alamat Email yang Terdaftar"
            type="email"
            required
            placeholder="Masukkan alamat email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Indikator Status Pengecekan Database */}
          {email.trim() && (
            <div
              style={{
                marginTop: '-10px',
                marginBottom: '18px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: checkingEmail
                  ? '#6b7280'
                  : isEmailRegistered === true
                  ? '#16a34a'
                  : isEmailRegistered === false
                  ? '#dc2626'
                  : '#6b7280',
              }}
            >
              {checkingEmail && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    border: '2px solid #9ca3af',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }}
                />
              )}
              <span>{emailStatusMessage}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isButtonDisabled}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: isButtonDisabled ? '#f2989b' : '#dc2626',
            color: '#ffffff',
            marginTop: '8px',
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: '8px',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            opacity: 1
          }}
        >
          {loading ? 'Mengirim Instruksi...' : 'Kirim Instruksi Pemulihan'}
        </Button>
      </form>

      <ReportLoadingModal isOpen={loading} text="Memproses pengiriman instruksi pemulihan..." />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
