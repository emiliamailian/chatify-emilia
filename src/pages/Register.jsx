import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar]   = useState('');
  const [error, setError]     = useState('');
  const [ok, setOk]           = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setOk(false);

    try {
      await register({ username, email, password, avatar: avatar || undefined });
      setOk(true);
      // liten paus så man hinner se "Registrerad!"
      setTimeout(() => nav('/login', { replace: true }), 800);
    } catch (err) {
      setError(err.message || 'Registrering misslyckades');
    }
  }

  return (
    <div className="container">
      <h1>Registrera</h1>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {ok && <p style={{ color: 'seagreen' }}>Registrerad! Skickar dig till Login…</p>}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          className="input"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Avatar URL (valfritt)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <button className="btn">Registrera</button>
      </form>

      <p>Har du konto? <Link to="/login">Logga in</Link></p>
    </div>
  );
}
