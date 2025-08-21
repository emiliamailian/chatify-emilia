import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Chat from './pages/Chat.jsx'
import RequireAuth from './auth/RequireAuth.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/', element: <Chat /> },
        ]
      }
    ]
  }
])
