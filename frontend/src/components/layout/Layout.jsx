import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Footer from './Footer'

const NAV = [
  { to: '/dashboard', icon: '⚡', label: 'Dashboard', section: 'Command Center' },
  { to: '/documents', icon: '📄', label: 'Documents' },
  { to: '/draft', icon: '✍️', label: 'Draft Generator' },
  { to: '/chat', icon: '💬', label: 'AI Chat', badge: 'AI' },
  { to: '/constituency', icon: '🗺️', label: 'Constituency', section: 'Intelligence' },
  { to: '/meeting', icon: '🎙️', label: 'Meeting Notes' },
  { to: '/scheduler', icon: '📅', label: 'Scheduler' },
]

const META = {
  '/dashboard': ['Dashboard', 'Command center overview'],
  '/documents': ['Document Intelligence', 'Upload & AI-summarize government documents'],
  '/draft': ['Draft Generator', 'AI speeches, letters & official documents'],
  '/chat': ['AI Co-Pilot Chat', 'Ask anything about governance & policy'],
  '/constituency': ['Constituency Intel', 'Ward data, schemes & complaint tracking'],
  '/meeting': ['Meeting Notes', 'Transcribe meetings & extract action items'],
  '/scheduler': ['Schedule & Tasks', 'Calendar management with AI briefs'],
}

export default function Layout() {
  const { pathname } = useLocation()
  const [meta0, meta1] = META[pathname] || ['GovCoPilot', '']
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("is_logged_in")
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen bg-bg relative overflow-hidden">
      {/* Moving Background Animations */}
      <div className="fixed top-0 left-0 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[50rem] h-[50rem] bg-orange-900/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-emerald-900/5 rounded-full mix-blend-screen filter blur-[150px] animate-pulse pointer-events-none z-0" style={{ animationDelay: '4s' }}></div>

      {/* Sidebar */}
      <aside className={`w-60 bg-surface/90 backdrop-blur-md border-r border-border1 flex flex-col fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 pb-4 border-b border-border1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron to-orange-700 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(255,153,51,0.3)]">🏛️</div>
            <div>
              <div className="font-display font-black text-base text-text1">Gov<span className="text-saffron">CoPilot</span></div>
              <div className="text-[9px] tracking-widest uppercase text-text3 mt-0.5">AI for Public Leaders</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-border1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-xs font-bold text-white">AK</div>
            <div>
              <div className="text-xs font-semibold text-text1">Arjun Kumar</div>
              <div className="text-[10px] text-text3">MLA · North Delhi</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-text3 hover:text-red-400 transition-colors tooltip tooltip-bottom" data-tip="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          {NAV.map(item => (
            <div key={item.to}>
              {item.section && <div className="text-[9px] tracking-widest uppercase text-text3 px-2.5 pt-4 pb-1.5">{item.section}</div>}
              <NavLink to={item.to} onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 relative transition-all font-display font-semibold text-sm border
                  ${isActive ? 'bg-saffron/10 text-saffron border-saffron/20' : 'text-text2 hover:bg-card hover:text-text1 border-transparent'}`}>
                {({ isActive }) => <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-saffron rounded-r" />}
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <span className="bg-saffron text-black text-[9px] font-black px-1.5 py-0.5 rounded">{item.badge}</span>}
                </>}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="px-5 py-3.5 border-t border-border1 space-y-3">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 transition-colors py-2 rounded-lg text-xs font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>

          <div className="flex items-center gap-2 text-[10px] text-text3 justify-center">
            <div className="flex h-1 w-8 rounded overflow-hidden">
              <div className="flex-1 bg-saffron" /><div className="flex-1 bg-white" /><div className="flex-1 bg-govgreen" />
            </div>
            India Innovates 2026
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen relative z-10">
        <header className="bg-surface/80 backdrop-blur-md border-b border-border1 flex items-center justify-between px-6 sticky top-0 z-40 h-[60px]">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 text-text2" onClick={() => setOpen(!open)}>☰</button>
            <div>
              <div className="font-display font-black text-lg text-text1 leading-tight">{meta0}</div>
              <div className="text-[11px] text-text3">{meta1}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-text3 mr-1"><div className="status-dot" />AI Online</div>
            <NavLink to="/draft"><button className="bg-card border border-border1 rounded-lg px-3 py-1.5 text-text2 text-xs font-display font-semibold hover:border-saffron hover:text-saffron transition-colors">✍️ New Draft</button></NavLink>
            <NavLink to="/chat"><button className="bg-saffron text-black rounded-lg px-3 py-1.5 text-xs font-display font-bold hover:bg-saffron2 transition-colors shadow-[0_0_15px_rgba(255,153,51,0.3)]">💬 Ask AI</button></NavLink>
          </div>
        </header>

        <main className="flex-1 p-6 page-enter flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  )
}
