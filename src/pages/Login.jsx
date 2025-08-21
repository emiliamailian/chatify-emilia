import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authService';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ username, password }); // { token, ... }
      const token = res?.token;
      if (!token) throw new Error('Ingen token mottogs');

      // spara token
      localStorage.setItem('token', token);

      // decoda för att få id/namn/avatar om finns
      let decoded = {};
      try { decoded = jwtDecode(token); } catch { decoded = {}; }

      const id     = decoded?.sub || decoded?.id || decoded?.userId || null;
      const name   = decoded?.username || username;
      const avatar = decoded?.avatar || `https://i.pravatar.cc/120?u=${encodeURIComponent(name)}`;

      localStorage.setItem('user', JSON.stringify({ id, username: name, avatar }));

      // vidare till chatten
      nav('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  }

  return (
    <div className="container">
      <h1>Logga in</h1>
      {error && <p style={{ color:'crimson' }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
        <input
          className="input"
          placeholder="Användarnamn"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <button className="btn">Logga in</button>
      </form>

      <p>Ny här? <Link to="/register">Skapa konto</Link></p>
    </div>
  );
}
