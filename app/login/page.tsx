'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { loginUser } from '../../services/api';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await loginUser(email, password);
      if (resp?.token) {
        login(resp.token);
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err: any) {
      setError(err.message ?? 'Erro ao iniciar sessão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button style={{ marginTop: 15 }} type="submit" disabled={loading}>
          {loading ? 'A carregar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
