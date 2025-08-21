import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/authService'
import { jwtDecode } from 'jwt-decode'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await login({ username, password })
    if (!res.success) { setError(res.message || 'Inloggning misslyckades'); return }

    let token = res.data?.token || res.data?.accessToken || res.data?.jwt || res.data?.jwtToken || res.data?.data?.token || res.data?.data?.accessToken || res.data?.data?.jwt
    if (!token) {
      const authHeader = res.headers?.authorization || res.headers?.Authorization
      if (authHeader && /^Bearer\s+/i.test(authHeader)) token = authHeader.replace(/^Bearer\s+/i,'')
    }
    if (!token) { setError('Ingen token mottagen från API'); return }

    localStorage.setItem('token', token)
    try {
      const claims = jwtDecode(token)
      const id = claims?.sub || claims?.id || claims?.userId || claims?.user?.id || null
      const name = claims?.username || claims?.user?.username || username || 'User'
      const avatar = claims?.avatar || claims?.user?.avatar || `https://i.pravatar.cc/120?u=${encodeURIComponent(name)}`
      localStorage.setItem('user', JSON.stringify({ id, username: name, avatar }))
    } catch {
      localStorage.setItem('user', JSON.stringify({ username, avatar: `https://i.pravatar.cc/120?u=${encodeURIComponent(username)}` }))
    }
    nav('/', { replace: true })
  }

  return (
    <div className="container">
      <h1>Logga in</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
        <input className="input" placeholder="Användarnamn" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input className="input" type="password" placeholder="Lösenord" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn">Logga in</button>
      </form>
      <p>Ny här? <Link to="/register">Skapa konto</Link></p>
    </div>
  )
}
