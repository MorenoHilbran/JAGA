import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  History,
  ShieldCheck,
  Activity,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Network,
  FileCheck,
  Sparkles,
} from 'lucide-react'
import { useJagaTheme } from '../context/ThemeContext'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, isDark, toggleTheme } = useJagaTheme()

  // Collapsible submenus state
  const [openSubmenus, setOpenSubmenus] = useState({
    investigation: true,
    analytics: false,
  })

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const menuItems = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      path: '/dashboard',
    },
    {
      id: 'investigation',
      text: 'Investigasi',
      icon: <Search className="w-4 h-4" />,
      path: '/investigation',
      hasSubmenu: true,
      subItems: [
        { text: 'Daftar Berkas', path: '/investigation' },
        { text: 'Pemeriksaan Graf', path: '/network/NET-2026-JKN-089' },
      ],
    },
    {
      id: 'analytics',
      text: 'Analitik',
      icon: <TrendingUp className="w-4 h-4" />,
      path: '/analytics',
    },
    {
      id: 'history',
      text: 'Riwayat',
      icon: <History className="w-4 h-4" />,
      path: '/history',
    },
  ]

  // Sembunyikan sidebar/header di landing page untuk tampilan full-bleed
  if (location.pathname === '/') {
    return (
      <div className={isDark ? 'bg-[#080B24] min-h-screen text-[#dfe0ff]' : 'bg-[#F4F6FB] min-h-screen text-[#0F172A]'}>
        {children}
      </div>
    )
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isDark ? 'bg-[#080B24] text-[#dfe0ff]' : 'bg-[#F4F6FB] text-[#0F172A]'}`}>
      {/* Sidebar */}
      <aside className={`w-60 flex-shrink-0 border-r flex flex-col justify-between z-20 ${isDark ? 'bg-[#0D1130] border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div>
          {/* Brand HUD Logo */}
          <div className={`h-14 px-4 border-b flex items-center justify-between ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-[2px] bg-[#35F2A0] flex items-center justify-center shadow-[0_0_10px_rgba(53,242,160,0.4)]">
                <ShieldCheck className="w-4 h-4 text-[#080B24]" />
              </div>
              <div>
                <span className={`font-headline font-bold text-sm tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  JAGA
                </span>
                <span className={`text-[10px] font-mono ml-1.5 font-semibold ${isDark ? 'text-[#35F2A0]' : 'text-[#0B945B]'}`}>
                  v1.0-DEF
                </span>
              </div>
            </div>
          </div>

          {/* System Telemetry Tag */}
          <div className={`px-4 py-2.5 border-b flex items-center justify-between text-[10px] font-mono ${isDark ? 'bg-[#090C25] border-white/6 text-[#859588]' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35F2A0] animate-pulse" />
              STATUS: AKTIF
            </span>
            <span className={isDark ? 'text-[#35F2A0]/80' : 'text-[#0B945B]'}>AGE NODE ON</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.path || (item.hasSubmenu && location.pathname.startsWith('/network/'))
              const isOpen = openSubmenus[item.id]

              return (
                <div key={item.id} className="space-y-0.5">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`
                        flex-1 flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium transition-all text-left
                        ${
                          active
                            ? isDark
                              ? 'bg-[#35F2A0]/10 text-white border-l-2 border-[#35F2A0] font-semibold'
                              : 'bg-[#0B945B]/10 text-[#0B945B] border-l-2 border-[#0B945B] font-semibold'
                            : isDark
                            ? 'text-[#9CA7C5] hover:bg-white/[0.04] hover:text-[#DFE0FF]'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <span className={active ? (isDark ? 'text-[#35F2A0]' : 'text-[#0B945B]') : (isDark ? 'text-[#859588]' : 'text-slate-400')}>
                        {item.icon}
                      </span>
                      <span>{item.text}</span>
                    </button>

                    {item.hasSubmenu && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSubmenu(item.id)
                        }}
                        className={`p-1.5 rounded-sm hover:bg-white/5 transition-colors cursor-pointer ${
                          isDark ? 'text-[#859588] hover:text-white' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="Toggle Sub-menu"
                      >
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Render Submenu if available and open */}
                  {item.hasSubmenu && isOpen && (
                    <div className={`pl-8 pr-1 py-1 space-y-1 border-l ml-4 my-0.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path
                        return (
                          <button
                            key={sub.text}
                            type="button"
                            onClick={() => navigate(sub.path)}
                            className={`
                              w-full flex items-center justify-between px-2 py-1.5 rounded-sm text-[11px] font-mono transition-all text-left
                              ${
                                isSubActive
                                  ? isDark
                                    ? 'text-[#35F2A0] font-bold bg-[#35F2A0]/10'
                                    : 'text-[#0B945B] font-bold bg-emerald-50'
                                  : isDark
                                  ? 'text-[#859588] hover:text-[#DFE0FF] hover:bg-white/[0.02]'
                                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                              }
                            `}
                          >
                            <span>{sub.text}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#35F2A0]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer info & Exit/Keluar Button */}
        <div className={`p-3 border-t text-[10px] font-mono space-y-2.5 ${isDark ? 'border-white/8 bg-[#090C25]/80 text-[#859588]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-[#DFE0FF]' : 'text-slate-700'}>AUDITOR: MORENO</span>
            <span className={isDark ? 'text-[#35F2A0]' : 'text-[#0B945B]'}>LEVEL 3</span>
          </div>
          <div className="text-[9px]">
            UU PDP • PRIVASI TERJAGA
          </div>

          {/* Button Keluar ke Landing Page */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm border text-xs font-mono font-medium transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-[#DFE0FF] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-2xs'
            }`}
            title="Keluar ke Landing Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className={`h-14 border-b px-6 flex items-center justify-between flex-shrink-0 z-10 ${isDark ? 'bg-[#0D1130] border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-[#859588]' : 'text-slate-400'}`}>
              MODUL //
            </span>
            <span className={`text-xs font-mono font-semibold ${isDark ? 'text-[#DFE0FF]' : 'text-slate-800'}`}>
              {location.pathname === '/dashboard'
                ? 'DASBOR COMMAND CENTER JKN'
                : location.pathname === '/investigation'
                ? 'RUANG KERJA INVESTIGASI BERKAS'
                : location.pathname === '/analytics'
                ? 'ANALITIK MODEL & TREN GRAF'
                : location.pathname === '/history'
                ? 'RIWAYAT AUDIT TRAIL UU PDP'
                : 'BERKAS INVESTIGASI SPESIFIK'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Theme Toggle Button - Matching Pill Gradient Style */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{ width: '32px', height: '32px' }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#48f7af] to-[#28d98b] text-[#080B24] border-t border-white/40 border-b-2 border-[#189b60] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer shadow-xs flex-shrink-0"
              title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
              aria-label="Ganti Tema"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-[#080B24]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#080B24]" />
              )}
            </button>

            <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[2px] border ${isDark ? 'bg-[#131735] border-white/8 text-[#9CA7C5]' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-[#35F2A0]' : 'text-[#0B945B]'}`} />
              <span className="text-[11px]">KONSENSUS AI:</span>
              <span className={`text-[11px] font-bold ${isDark ? 'text-[#35F2A0]' : 'text-[#0B945B]'}`}>97.2% PRESISI</span>
            </div>

            {/* Exit Button Icon Only */}
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ width: '32px', height: '32px' }}
              className={`inline-flex items-center justify-center rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-[#9CA7C5] hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-2xs'
              }`}
              title="Keluar"
              aria-label="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-[#080B24]' : 'bg-[#F4F6FB]'}`}>
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
