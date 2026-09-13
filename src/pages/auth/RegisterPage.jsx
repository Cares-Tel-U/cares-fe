import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      if (onRegisterSuccess) {
        onRegisterSuccess({
          name,
          email,
          role: 'Mahasiswa',
          nim: '1301223099'
        });
      }
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Daftarkan akun untuk mulai melaporkan masalah fasilitas kampus."
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nama Lengkap"
          type="text"
          required
          placeholder="Masukkan nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="Masukkan alamat email kampus"
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
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ width: '100%', marginTop: '8px' }}
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

