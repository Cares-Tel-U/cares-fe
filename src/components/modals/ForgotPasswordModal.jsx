import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { authService } from '../../services/auth.service';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Minta Reset, 2: Reset Password, 3: Sukses
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessInfo('');
    onClose();
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(trimmedEmail);
      const generatedToken = res.data?.resetToken || '';
      setToken(generatedToken);
      setSuccessInfo(res.message || 'Tautan pemulihan kata sandi telah dikirim ke email terdaftar.');
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal memproses permintaan reset kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!token.trim()) {
      setErrorMessage('Token reset kata sandi wajib diisi.');
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('Kata sandi baru minimal 8 karakter dan wajib mengandung huruf besar, huruf kecil, serta angka.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token.trim(), newPassword);
      setStep(3);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mereset kata sandi. Token mungkin tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  const modalNode = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
        backdropFilter: 'blur(3px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
            {step === 3 ? 'Kata Sandi Berhasil Direset' : 'Lupa Kata Sandi'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#9ca3af',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              lineHeight: '1.4',
              marginBottom: '16px',
              fontWeight: '500',
            }}
          >
            {errorMessage}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestReset} noValidate>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '18px', lineHeight: '1.5' }}>
              Masukkan alamat email akun CARES Anda yang terdaftar untuk menerima token pemulihan kata sandi.
            </p>

            <Input
              label="Alamat Email Terdaftar"
              type="email"
              required
              placeholder="Contoh: mahasiswa@telkomuniversity.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleClose}
                style={{ flex: 1, borderRadius: '8px' }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: loading ? '#f2989b' : '#dc2626',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              >
                {loading ? 'Mengirim...' : 'Kirim Token'}
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate>
            <div
              style={{
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                lineHeight: '1.4',
                marginBottom: '16px',
              }}
            >
              {successInfo || 'Token pemulihan kata sandi telah diproses.'}
            </div>

            <Input
              label="Token Pemulihan"
              type="text"
              required
              placeholder="Masukkan token pemulihan kata sandi"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <Input
              label="Kata Sandi Baru"
              type="password"
              required
              placeholder="Minimal 8 karakter (huruf besar, kecil, angka)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              required
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                style={{ flex: 1, borderRadius: '8px' }}
              >
                Kembali
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: loading ? '#f2989b' : '#dc2626',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: '1.5', marginBottom: '24px' }}>
              Kata sandi akun Anda telah berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.
            </p>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleClose}
              style={{ width: '100%', backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '8px' }}
            >
              Masuk Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};

export default ForgotPasswordModal;
