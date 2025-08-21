import { useNavigate, Link } from 'react-router-dom'

export default function SideNav() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    nav('/login', { replace: true })
  }
  return (
    <aside className="sidenav">
      <div style={{display:'grid', gap:8}}>
        <Link to="/">Chat</Link>
        <button className="btn" onClick={logout}>Logga ut</button>
      </div>
    </aside>
  )
}
