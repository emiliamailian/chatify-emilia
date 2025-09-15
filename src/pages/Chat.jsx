// src/pages/Chat.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import SideNav from '../components/SideNav.jsx'
import DOMPurify from 'dompurify'

const API = import.meta.env.VITE_API_BASE

export default function Chat() {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Hämta alla meddelanden (endast JWT)
  async function loadMessages() {
    setError(null)
    try {
      const res = await fetch(`${API}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => [])
      if (!res.ok) throw new Error(data?.message || `Fel ${res.status}`)
      setMessages(Array.isArray(data) ? data : data?.messages || [])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadMessages() }, [])

  // Skicka nytt (endast JWT)
  async function sendMessage(e) {
    e.preventDefault()
    const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
    if (!clean) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: clean }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Fel ${res.status}`)
      setText('')
      await loadMessages()
    } catch (e) {
      setError(e.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  // Radera (endast JWT)
  async function removeMessage(id) {
    try {
      const res = await fetch(`${API}/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Fel ${res.status}`)
      }
      setMessages(prev => prev.filter(m => (m.id || m._id) !== id))
    } catch (e) {
      setError(e.message || 'Failed to fetch')
    }
  }

  const messageId = (m) => m.id || m._id
  const isMine = (m) => {
    const uid = user?.id
    return m.userId === uid || m.user_id === uid || m.user?.id === uid
  }

  return (
    <main style={{ padding: 16, maxWidth: 760, margin: '0 auto' }}>
      {/* Sidenav med logout-knapp */}
      <SideNav />

      {/* Header (utan logout – den finns i sidenav) */}
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <img
          src={user?.avatar || 'https://i.pravatar.cc/64'}
          alt="avatar"
          width={40}
          height={40}
          style={{ borderRadius: '50%' }}
          referrerPolicy="no-referrer"
        />
        <div>
          <h2 style={{ margin: 0 }}>Chat</h2>
          {user && <small>Inloggad som <strong>{user.username || user.name || user.id}</strong></small>}
        </div>
      </header>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, minHeight: 240, background: '#fafafa' }}>
        {messages.length === 0 && <p>Inga meddelanden ännu.</p>}
        {messages.map((m) => (
          <div key={messageId(m)} style={{ display: 'flex', justifyContent: isMine(m) ? 'flex-end' : 'flex-start', margin: '8px 0' }}>
            <div style={{ background: isMine(m) ? '#e6f7ff' : '#f3f3f3', padding: '8px 12px', borderRadius: 12, maxWidth: '70%' }}>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {m.text || m.message}
              </div>
              {isMine(m) && (
                <div style={{ textAlign: 'right', marginTop: 4 }}>
                  <button onClick={() => removeMessage(messageId(m))} style={{ fontSize: 12 }}>Radera</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv ett meddelande…"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading}>{loading ? 'Skickar…' : 'Skicka'}</button>
      </form>
    </main>
  )
}
