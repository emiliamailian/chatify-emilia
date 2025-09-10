import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_BASE

async function getCsrf() {
  const res = await fetch(`${API}/csrf`, { method: 'PATCH', credentials: 'include' })
  const data = await res.json().catch(() => ({}))
  return data?.csrf || data?.csrfToken || data?.token || null
}

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/200')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const csrf = await getCsrf()
      if (!csrf) throw new Error('Kunde inte hämta CSRF')

      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrf,
        },
        body: JSON.stringify({ username, email, password, avatar }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.message || data?.error || `Fel ${res.status}`
        throw new Error(msg)
      }

      nav('/login', { replace: true })
    } catch (err) {
      setError(err?.message || 'Registrering misslyckades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 500 }}>
      <h1>Registrera</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginTop: 12 }}>
          Användarnamn
          <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2}
                 style={{ display: 'block', width: '100%', padding: 8 }}/>
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          E-post
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                 style={{ display: 'block', width: '100%', padding: 8 }}/>
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Lösenord
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                 style={{ display: 'block', width: '100%', padding: 8 }}/>
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Avatar-URL
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://i.pravatar.cc/200"
                 style={{ display: 'block', width: '100%', padding: 8 }}/>
        </label>
        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: '8px 12px' }}>
          {loading ? 'Registrerar…' : 'Registrera'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Har du redan konto? <Link to="/login">Logga in</Link>
      </p>
    </main>
  )
}
