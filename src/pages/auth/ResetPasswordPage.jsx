import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
import { authService } from '../../services/auth.service';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const getPasswordError = () => {
    if (!isSubmitted && !password) return '';
    if (password.length > 0 && password.length < 8) {
      return 'Password kurang dari 8 karakter';
    }
    if (password.length >= 8 && !passwordRegex.test(password)) {
      return 'Password wajib minimal 8 karakter dan mengandung kombinasi huruf besar, huruf kecil, serta angka';
    }
    if (isSubmitted && !password) {
      return 'Password baru wajib diisi';
    }
    return '';
  };

  const getConfirmPasswordError = () => {
    if (!isSubmitted && !confirmPassword) return '';
    if (isSubmitted && !confirmPassword) {
      return 'Konfirmasi password baru wajib diisi';
    }
    if (confirmPassword && password !== confirmPassword) {
      return 'Konfirmasi password baru tidak cocok';
    }
    return '';
  };

  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setGeneralError('');

    if (!token) {
      setGeneralError('Token pemulihan kata sandi tidak ditemukan atau tidak valid. Silakan ajukan permintaan ulang.');
      return;
    }

    if (!password || !passwordRegex.test(password)) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword(token, password);
      setSuccessMessage(res?.message || 'Kata sandi berhasil diperbarui.');

      setTimeout(() => {
        navigate('/login', {
          state: {
            notificationMessage: 'Kata sandi Anda telah berhasil diatur ulang. Silakan masuk dengan kata sandi baru Anda.',
          },
        });
      }, 1500);
    } catch (err) {
      setGeneralError(err.message || 'Gagal mengatur ulang kata sandi. Tautan mungkin telah kedaluwarsa atau tidak valid.');
      setLoading(false);
    }
  };

  const isFormInvalid = !password || !confirmPassword || !passwordRegex.test(password) || password !== confirmPassword;

  return (
    <AuthLayout title="" subtitle="">
      {/* Tautan Batal dan Kembali ke Halaman Masuk */}
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
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ba181b')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Batal dan Kembali ke Halaman Masuk
        </Link>
      </div>

      <h2
        style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}
      >
        Atur Ulang Kata Sandi
      </h2>

      <p
        style={{
          fontSize: '13.5px',
          color: '#6b7280',
          marginBottom: '26px',
          lineHeight: '1.5',
        }}
      >
        Silakan buat password baru untuk mengamankan akun CARES Anda
      </p>

      {/* Validasi ketiadaan token */}
      {!token && (
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
            marginBottom: '20px',
          }}
        >
          Tautan pemulihan kata sandi tidak valid atau token tidak ditemukan. Silakan ajukan permintaan lupa kata sandi kembali melalui tautan di bawah.
        </div>
      )}

      {/* Pesan Sukses */}
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
            marginBottom: '20px',
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Pesan Error Umum */}
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
            marginBottom: '20px',
          }}
        >
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Password Baru"
          type="password"
          required
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (generalError) setGeneralError('');
          }}
          error={passwordError}
          helperText={!passwordError ? 'Minimal 8 karakter dengan huruf besar, huruf kecil, dan angka' : ''}
        />

        <Input
          label="Konfirmasi Password Baru"
          type="password"
          required
          placeholder="Masukkan password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (generalError) setGeneralError('');
          }}
          error={confirmPasswordError}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isFormInvalid || loading || !token}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: isFormInvalid || loading || !token ? '#f2989b' : '#dc2626',
            color: '#ffffff',
            marginTop: '8px',
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: '8px',
            cursor: isFormInvalid || loading || !token ? 'not-allowed' : 'pointer',
            opacity: 1,
          }}
        >
          {loading ? 'Menyimpan Password...' : 'Simpan Password'}
        </Button>
      </form>

      <ReportLoadingModal isOpen={loading} text="Menyimpan kata sandi baru..." />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
