import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const jeton = data?.accessToken ?? data?.token ?? data?.data?.accessToken ?? data?.data?.token;
      if (res.ok && jeton) {
        localStorage.setItem('accessToken', jeton);
        localStorage.setItem('token', jeton);
        navigate('/my-posts', { replace: true });
      } else {
        setMessage(data?.message || data?.error || 'Giriş başarısız. E-posta veya şifre hatalı.');
      }
    } catch {
      setMessage('Sunucuya bağlanılamadı. Backend çalışıyor mu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 20px 60px rgba(99,102,241,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            CL
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0f172a' }}>CodeLog</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Yazı paneli</div>
          </div>
        </div>

        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
          Giriş Yap
        </h2>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
        </button>

        {message && (
          <p
            style={{
              margin: 0,
              padding: '0.6rem 1rem',
              borderRadius: '0.6rem',
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.85rem',
              border: '1px solid #fecaca',
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
