import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function GuestOnly({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Om man redan är inloggad -> skicka till /chat
  if (isAuthenticated) {
    return <Navigate to="/chat" replace state={{ from: location }} />
  }

  // Annars får man se sidan (login/register)
  return children
}
