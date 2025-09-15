import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Chat from './pages/Chat.jsx'
import Protected from './components/Protected.jsx'
import GuestOnly from './components/GuestOnly.jsx'

export default function App() {
  return (
    <Routes>
      {/* Roten -> /login (GuestOnly ser till att inloggade hamnar på /chat) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Gäst-sidor: visas bara när man är utloggad */}
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />

      {/* Skyddad sida: kräver inloggning */}
      <Route
        path="/chat"
        element={
          <Protected>
            <Chat />
          </Protected>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
