import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function SideNav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        aria-label="Öppna meny"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 50,
          padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff'
        }}
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40
          }}
        >
          <nav
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 260,
              background: '#fff', padding: 16, boxShadow: '2px 0 12px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img
                src={user?.avatar || 'https://i.pravatar.cc/64'}
                alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }}
                referrerPolicy="no-referrer"
              />
              <div>
                <div style={{ fontWeight: 600 }}>{user?.username || user?.name || 'Användare'}</div>
                <small>ID: {user?.id}</small>
              </div>
            </div>

            <button
              onClick={logout}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#f7f7f7' }}
            >
              Logga ut
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
