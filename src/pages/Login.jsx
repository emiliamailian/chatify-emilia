import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('') 
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ identifier, password })
    } catch (err) {
      setError(err?.message || 'Inloggning misslyckades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginTop: 12 }}>
          Användarnamn
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '8px 12px' }}>
          {loading ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Har du inget konto? <Link to="/register">Registrera dig</Link>
      </p>
    </main>
  )
}
