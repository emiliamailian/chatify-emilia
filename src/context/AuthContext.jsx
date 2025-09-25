import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)
const TOKEN_KEY = 'chatify_token'
const API = import.meta.env.VITE_API_BASE

async function getCsrf() {
  const res = await fetch(`${API}/csrf`, { method: 'PATCH', credentials: 'include' })
  const data = await res.json().catch(() => ({}))
  return data.csrfToken;
}

async function loginRequest(identifier, password, csrf) {
  const payload = { username: identifier, password, csrfToken: csrf }

  const res = await fetch(`${API}/auth/token`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.message || data?.error || 'Login failed'
    throw new Error(msg)
  }
  return data?.token
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) { setUser(null); return }
    try {
      const p = jwtDecode(token)
      setUser({
        id: p?.id || p?.sub,
        username: p?.username || p?.name || p?.email,
        avatar: p?.avatar,
      })
    } catch {
      setUser(null)
    }
  }, [token])

  const login = async ({ identifier, email, username, password }) => {
    const id = identifier ?? email ?? username
    const csrf = await getCsrf()
    if (!csrf) throw new Error('Kunde inte hämta CSRF')
    const t = await loginRequest(id, password, csrf)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    navigate('/chat', { replace: true })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    navigate('/login', { replace: true })
  }

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
