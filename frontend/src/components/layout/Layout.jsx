import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { Header } from '../ui/header-2'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-bg relative">
      {/* Moving Background Animations */}
      <div className="fixed top-0 left-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[50rem] h-[50rem] bg-orange-900/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-emerald-900/5 rounded-full mix-blend-screen filter blur-[150px] animate-pulse pointer-events-none z-0" style={{ animationDelay: '4s' }}></div>

      {/* New Top Navigation Bar */}
      <Header />

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto md:px-6">
        <main className="flex-1 p-6 page-enter flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
