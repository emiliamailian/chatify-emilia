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
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOk(null)
    try {
      const csrf = await getCsrf()
      if (!csrf) throw new Error('Invalid CSRF token')

      const chosenAvatar =
        (avatar && avatar.trim()) ||
        `https://i.pravatar.cc/200?u=${encodeURIComponent(username || email)}`

      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          avatar: chosenAvatar,
          csrfToken: csrf,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.message || data?.error || `Fel ${res.status}`
        throw new Error(msg)
      }

      setOk('Registrerad! Du skickas till Login...')
      setTimeout(() => nav('/login', { replace: true }), 1000)
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
      {ok && <p style={{ color: 'green' }}>{ok}</p>}
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
          Avatar-URL (valfritt)
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Lämna tomt för unik pravatar"
            style={{ display: 'block', width: '100%', padding: 8 }}
          />
          <small>Standard blir t.ex. https://i.pravatar.cc/200?u=&lt;ditt användarnamn&gt;</small>
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
