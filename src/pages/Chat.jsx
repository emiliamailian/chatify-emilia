import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { getMessages, createMessage, deleteMessage } from '../api/chatService'
import Message from '../components/Message.jsx'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const user = useMemo(()=>{
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  }, [])

  async function load() {
    setError('')
    const res = await getMessages()
    if (!res.success) { setError(res.message || 'Kunde inte hämta meddelanden'); return }
    const arr = Array.isArray(res.data) ? res.data : res.data?.messages || []
    setMessages(arr)
  }

  useEffect(()=>{ load() }, [])

  async function send(e) {
    e.preventDefault()
    setError('')
    const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()
    if (!clean) return
    const res = await createMessage(clean)
    if (!res.success) { setError(res.message || 'Kunde inte skicka meddelande'); return }
    setText(''); load()
  }

  async function remove(id) {
    const res = await deleteMessage(id)
    if (!res.success) { setError(res.message || 'Kunde inte radera meddelande'); return }
    load()
  }

  return (
    <div>
      <header style={{display:'flex',gap:12,alignItems:'center',margin:'12px 0'}}>
        {user?.avatar && <img src={user.avatar} alt="" width="40" height="40" style={{borderRadius:'50%'}}/>}
        <div>
          <div style={{fontWeight:600}}>{user?.username || 'Inloggad'}</div>
          <small className="muted">Inloggad</small>
        </div>
      </header>

      {error && <p style={{color:'crimson'}}>{error}</p>}

      <section style={{display:'grid', gap:10, margin:'16px 0'}}>
        {messages.map(m => (
          <div key={m.id || m._id || m.messageId || `${m.createdAt}-${m.username}`} style={{display:'flex', justifyContent: (m.userId===user?.id || m.user_id===user?.id ? 'flex-end' : 'flex-start')}}>
            <Message msg={m} meId={user?.id} onDelete={()=> remove(m.id || m._id)} />
          </div>
        ))}
      </section>

      <form onSubmit={send} className="row">
        <input className="input" placeholder="Skriv ett meddelande…" value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn">Skicka</button>
      </form>
    </div>
  )
}
