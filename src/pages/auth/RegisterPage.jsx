import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/auth.service';

const RegisterPage = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('Amba Ngawi');
  const [nim, setNim] = useState('103012400229');
  const [email, setEmail] = useState('ambangawi@telkomuniversity.ac.id');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordShort = password.length > 0 && password.length < 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setRegisterError('');

    if (password.length < 8 || !name || !email) {
      return;
    }

    setLoading(true);
    try {
      const newUser = await authService.register(name.trim(), email.trim(), password, 'MAHASISWA');
      
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
    </AuthLayout>
  );
};

export default RegisterPage;
