import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
import { authService } from '../../services/auth.service';

const RegisterPage = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validasi format
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Evaluasi error untuk setiap field
  const getNameError = () => {
    if (!isSubmitted) return '';
    const trimmed = name.trim();
    if (!trimmed) return 'Nama lengkap wajib diisi';
    if (trimmed.length < 2 || trimmed.length > 50) {
      return 'Nama lengkap harus terdiri dari 2 hingga 50 karakter';
    }
    return '';
  };

  const getNimError = () => {
    if (!isSubmitted) return '';
    const trimmed = nim.trim();
    if (!trimmed) return 'Nomor induk mahasiswa/pegawai wajib diisi';
    if (!/^\d+$/.test(trimmed)) {
      return 'NIM harus berupa angka';
    }
    return '';
  };

  const getEmailError = () => {
    if (!isSubmitted) return '';
    const trimmed = email.trim();
    if (!trimmed) return 'Alamat email wajib diisi';
    if (!emailRegex.test(trimmed)) {
      return 'Format alamat email tidak valid';
    }
    return '';
  };

  const isPasswordShort = password.length > 0 && password.length < 8;

  const getPasswordError = () => {
    if (isPasswordShort) {
      return 'Password kurang dari 8 karakter';
    }
    if (password.length >= 8 && !passwordRegex.test(password)) {
      return 'Password wajib minimal 8 karakter dan mengandung kombinasi huruf besar, huruf kecil, serta angka';
    }
    if (isSubmitted && !password) {
      return 'Password wajib diisi';
    }
    return '';
  };

  const nameError = getNameError();
  const nimError = getNimError();
  const emailError = getEmailError();
  const passwordError = getPasswordError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setRegisterError('');

    const trimmedName = name.trim();
    const trimmedNim = nim.trim();
    const trimmedEmail = email.trim();

    if (
      trimmedName.length < 2 ||
      trimmedName.length > 50 ||
      !trimmedNim ||
      !/^\d+$/.test(trimmedNim) ||
      !trimmedEmail ||
      !emailRegex.test(trimmedEmail) ||
      !passwordRegex.test(password)
    ) {
      return;
    }

    setLoading(true);
    try {
      const newUser = await authService.register(
        trimmedName,
        trimmedEmail,
        password,
        'MAHASISWA',
        trimmedNim
      );

      if (onRegisterSuccess) {
        onRegisterSuccess({
          id: newUser.id,
          name: newUser.nama,
          email: newUser.email,
          role: 'Mahasiswa',
        });
      }

      // Arahkan ke halaman login
      navigate('/login');
    } catch (err) {
      setRegisterError(err.message || 'Gagal melakukan pendaftaran. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Daftarkan akun untuk mulai melaporkan masalah fasilitas kampus."
    >
      {registerError && (
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
          {registerError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nama Lengkap"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (registerError) setRegisterError('');
          }}
          error={nameError}
        />

        <Input
          label="Nomor Induk Mahasiswa/Pegawai"
          type="text"
          required
          placeholder="Masukkan nomor induk mahasiswa/pegawai"
          value={nim}
          onChange={(e) => {
            setNim(e.target.value.replace(/\D/g, ''));
            if (registerError) setRegisterError('');
          }}
          error={nimError}
        />

        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="Masukkan alamat email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (registerError) setRegisterError('');
          }}
          error={emailError}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (registerError) setRegisterError('');
          }}
          error={passwordError}
          helperText={!passwordError ? 'Minimal 8 karakter dengan huruf besar, huruf kecil, dan angka' : ''}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPasswordShort || loading}
          style={{
            width: '100%',
            marginTop: '8px',
            backgroundColor: isPasswordShort || loading ? '#f2989b' : '#dc2626',
            color: '#ffffff',
            cursor: isPasswordShort || loading ? 'not-allowed' : 'pointer',
            opacity: 1
          }}
        >
          {loading ? 'Memproses...' : 'Sign Up'}
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
        Sudah punya akun?{' '}
        <Link
          to="/login"
          style={{
            color: '#ba181b',
            textDecoration: 'none',
            fontWeight: '700'
          }}
        >
          Login
        </Link>
      </div>

      <ReportLoadingModal isOpen={loading} text="Memproses pendaftaran..." />
    </AuthLayout>
  );
};

export default RegisterPage;
