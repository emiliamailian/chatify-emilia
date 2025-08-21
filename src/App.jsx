import { Outlet, useLocation } from 'react-router-dom'
import SideNav from './components/SideNav.jsx'

export default function App() {
  const { pathname } = useLocation()
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  const hasToken = !!localStorage.getItem('token')
  return (
    <div className="app">
      {!isAuth && hasToken && <SideNav />}
      <main className={hasToken ? 'main container' : 'container'}>
        <Outlet />
      </main>
    </div>
  )
}
