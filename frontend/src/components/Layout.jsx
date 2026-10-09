import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  Network,
  ShieldCheck,
  Activity,
  Terminal,
  ExternalLink,
} from 'lucide-react'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { text: 'Beranda Sistem', icon: <Home className="w-4 h-4" />, path: '/' },
    { text: 'Dasbor Triage', icon: <LayoutDashboard className="w-4 h-4" />, path: '/dashboard' },
    { text: 'Analitik RiskGraph', icon: <Network className="w-4 h-4" />, path: '/analytics' },
  ]

  // Sembunyikan sidebar/header di landing page untuk tampilan full-bleed
  if (location.pathname === '/') {
    return <div className="bg-[#080B24] min-h-screen text-[#dfe0ff]">{children}</div>
  }

  return (
    <div className="flex h-screen bg-[#080B24] text-[#dfe0ff] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0D1130] border-r border-white/8 flex flex-col justify-between z-20">
        <div>
          {/* Brand HUD Logo */}
          <div className="h-14 px-4 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-[2px] bg-[#35F2A0] flex items-center justify-center shadow-[0_0_10px_rgba(53,242,160,0.4)]">
                <ShieldCheck className="w-4 h-4 text-[#080B24]" />
              </div>
              <div>
                <span className="font-headline font-bold text-sm tracking-wider text-white">
                  JAGA
                </span>
                <span className="text-[10px] font-mono text-[#35F2A0] ml-1.5 font-semibold">
                  v1.0-DEF
                </span>
              </div>
            </div>
          </div>

          {/* System Telemetry Tag */}
          <div className="px-4 py-2.5 bg-[#090C25] border-b border-white/6 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#859588] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35F2A0] animate-pulse" />
              STATUS: AKTIF
            </span>
            <span className="text-[#35F2A0]/80">AGE NODE ON</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <button
                  key={item.text}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium transition-all
                    ${
                      active
                        ? 'bg-[#35F2A0]/10 text-white border-l-2 border-[#35F2A0] font-semibold'
                        : 'text-[#9CA7C5] hover:bg-white/[0.04] hover:text-[#DFE0FF]'
                    }
                  `}
                >
                  <span className={active ? 'text-[#35F2A0]' : 'text-[#859588]'}>
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-white/8 bg-[#090C25]/80 text-[10px] font-mono text-[#859588] space-y-1">
          <div className="flex items-center justify-between text-[#DFE0FF]">
            <span>AUDITOR: MORENO</span>
            <span className="text-[#35F2A0]">LEVEL 3</span>
          </div>
          <div className="text-[9px] text-[#859588]">
            UU PDP • PRIVASI TERJAGA
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-[#0D1130] border-b border-white/8 px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#859588] uppercase tracking-wider">
              MODUL //
            </span>
            <span className="text-xs font-mono font-semibold text-[#DFE0FF]">
              {location.pathname === '/dashboard'
                ? 'TRIAGE KASUS FRAUD JKN'
                : location.pathname === '/analytics'
                ? 'ANALITIK GRAF JARINGAN'
                : 'BERKAS INVESTIGASI'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#131735] border border-white/8">
              <Activity className="w-3.5 h-3.5 text-[#35F2A0]" />
              <span className="text-[11px] text-[#9CA7C5]">KONSENSUS AI:</span>
              <span className="text-[11px] text-[#35F2A0] font-bold">97.2% PRESISI</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-[11px] text-[#9CA7C5] hover:text-[#35F2A0] transition-colors"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#080B24]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
