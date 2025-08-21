import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authService'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', avatar: '' })
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setOk(false)
    const res = await registerUser(form)
    if (!res.success) {
      setError(res.message || 'Registrering misslyckades')
      return
    }
    setOk(true)
    setTimeout(()=> nav('/login', { replace: true }), 800)
  }

  return (
    <div className="container">
      <h1>Registrera</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      {ok && <p style={{color:'seagreen'}}>Registrerad! Skickar dig till Login…</p>}
      <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
        <input className="input" placeholder="Användarnamn" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required/>
        <input className="input" type="email" placeholder="E-post" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input className="input" type="password" placeholder="Lösenord" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <input className="input" placeholder="Avatar URL (valfritt)" value={form.avatar} onChange={e=>setForm({...form, avatar:e.target.value})} />
        <button className="btn">Registrera</button>
      </form>
      <p>Har du konto? <Link to="/login">Logga in</Link></p>
    </div>
  )
}
