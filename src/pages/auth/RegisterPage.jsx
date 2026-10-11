import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('Amba Ngawi');
  const [nim, setNim] = useState('103012400229');
  const [email, setEmail] = useState('ambangawi@gmail.com');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isPasswordShort = password.length > 0 && password.length < 8;
  const isFormInvalid = !name || !nim || !email || password.length < 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (password.length < 8) {
      return;
    }

    if (name && nim && email && password.length >= 8) {
      const userData = {
        name,
        nim,
        email,
        password,
        role: 'Mahasiswa'
      };

      // Simpan akun pelapor yang baru terdaftar ke localStorage untuk dicocokkan saat login
      try {
        localStorage.setItem('cares_registered_user', JSON.stringify(userData));
      } catch (err) {
        console.error('Failed to save user in localStorage', err);
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(userData);
      }
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Daftarkan akun untuk mulai melaporkan masalah fasilitas kampus."
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nama Lengkap"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Nomor Induk Mahasiswa/Pegawai"
          type="text"
          required
          placeholder="Masukkan nomor induk mahasiswa/pegawai"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
        />

        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="Masukkan alamat email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={isPasswordShort || (isSubmitted && password.length < 8) ? 'Password kurang dari 8 karakter' : ''}
          helperText={!isPasswordShort && !(isSubmitted && password.length < 8) ? 'Password minimal 8 karakter' : ''}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPasswordShort}
          style={{
            width: '100%',
            marginTop: '8px',
            backgroundColor: isPasswordShort ? '#f2989b' : '#dc2626',
            color: '#ffffff',
            cursor: isPasswordShort ? 'not-allowed' : 'pointer',
            opacity: 1
          }}
        >
          Sign Up
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
    </AuthLayout>
  );
};

export default RegisterPage;
