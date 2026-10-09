import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useJagaTheme } from '../context/ThemeContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, isDark, toggleTheme } = useJagaTheme()
  const [selectedCase, setSelectedCase] = useState('0241')
  const [activeSection, setActiveSection] = useState('')

  const cases = [
    {
      id: '0241',
      title: 'Sindikat Klinik Pratama Medika',
      subtitle: 'Rujukan laboratorium fiktif pada 12 dokter.',
      risk: 92,
      exposure: 'Rp 8.240.000.000',
      tag: 'KRITIS',
      finding: '"12 dokter merujuk 91% pasien fisioterapi ke Klinik Pratama Medika. Teridentifikasi 42 klaim identik (ICD-10 M54.5) yang diajukan bersamaan dari alamat IP tunggal (103.14.88.19)."'
    },
    {
      id: '0182',
      title: 'RSIA Bunda Nusantara',
      subtitle: 'Klaster pemisahan klaim (unbundling) tindakan bedah khusus.',
      risk: 81,
      exposure: 'Rp 3.410.000.000',
      tag: 'KRITIS',
      finding: '"Pola unbundling klaim bedah sesar terdeteksi pada 28 episode perawatan. Pemisahan komponen klaim utama menjadi 3 sub-prosedur sekunder melampaui limit tarif faskes."'
    },
    {
      id: '0117',
      title: 'Apotek Sehat Group',
      subtitle: 'Pengambilan resep otomatis atas peserta meninggal dunia.',
      risk: 64,
      exposure: 'Rp 1.150.000.000',
      tag: 'TINGGI',
      finding: '"Pengambilan resep obat kronis otomatis tercatat atas nama 14 pesertaan non-aktif/meninggal dunia. Anomali frekuensi klaim 4x lebih tinggi dibanding rata-rata faskes sejenis."'
    }
  ]

  const activeCase = cases.find(c => c.id === selectedCase) || cases[0]

  // Smooth scroll handler dengan penyesuaian header offset
  const scrollToSection = (e, sectionId) => {
    if (e) e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 70
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Pengacuan seksi aktif saat bergulir
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['paradigm', 'pillars', 'cockpit', 'security']
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`w-full min-h-screen font-sans antialiased overflow-x-hidden ${isDark ? 'bg-[#080B24] text-on-surface' : 'bg-[#F4F6FB] text-slate-800'}`}>
      {/* ========================================== */}
      {/* BILAH NAVIGASI                             */}
      {/* ========================================== */}
      <header className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${isDark ? 'bg-[#080B24]/90 border-outline-variant/30' : 'bg-white/90 border-slate-200 shadow-xs'}`}>
        <div className="h-16 w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-primary-container' : 'bg-emerald-500'}`}></span>
              <span className={`font-headline text-lg font-extrabold tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>JAGA</span>
            </Link>
            <div className={`hidden lg:flex items-center pl-3 border-l ${isDark ? 'border-outline-variant/40 text-on-surface-variant' : 'border-slate-300 text-slate-500'}`}>
              <span className="font-mono text-[11px] uppercase tracking-wider">Jaringan Analitik Guard Anti-fraud</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <a
              href="#paradigm"
              onClick={(e) => scrollToSection(e, 'paradigm')}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeSection === 'paradigm'
                  ? isDark
                    ? 'bg-surface-container-high text-primary-container font-semibold border border-primary-container/30'
                    : 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : isDark
                  ? 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Ringkasan
            </a>
            <a
              href="#pillars"
              onClick={(e) => scrollToSection(e, 'pillars')}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeSection === 'pillars'
                  ? isDark
                    ? 'bg-surface-container-high text-primary-container font-semibold border border-primary-container/30'
                    : 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : isDark
                  ? 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Arsitektur
            </a>
            <a
              href="#cockpit"
              onClick={(e) => scrollToSection(e, 'cockpit')}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeSection === 'cockpit'
                  ? isDark
                    ? 'bg-surface-container-high text-primary-container font-semibold border border-primary-container/30'
                    : 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : isDark
                  ? 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Pratinjau Kokpit
            </a>
            <a
              href="#security"
              onClick={(e) => scrollToSection(e, 'security')}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeSection === 'security'
                  ? isDark
                    ? 'bg-surface-container-high text-primary-container font-semibold border border-primary-container/30'
                    : 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                  : isDark
                  ? 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tata Kelola & Teknologi
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                isDark
                  ? 'bg-[#131735] border-white/10 text-[#DFE0FF] hover:border-[#35F2A0] hover:text-[#35F2A0]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700'
              }`}
              title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FCD34D]" />
                  <span className="hidden sm:inline">TERANG</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">GELAP</span>
                </>
              )}
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-b from-[#48f7af] to-[#28d98b] text-[#080B24] font-headline text-xs font-bold border-t border-white/40 border-b-2 border-[#189b60] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Jelajahi Platform</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={`w-full pt-16 ${isDark ? 'bg-[#080B24]' : 'bg-[#F4F6FB]'}`}>
        {/* ========================================== */}
        {/* 01. SEKSI HERO                             */}
        {/* ========================================== */}
        <section className="relative w-full overflow-hidden px-4 md:px-8 pt-12 pb-16 lg:py-20 border-b border-outline-variant/20">
          {/* Latar Belakang Vektor Grid & Graf */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="heroGrid" width="44" height="44" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#859588" fillOpacity="0.25"></circle>
                  <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#2c345b" strokeWidth="0.5" strokeOpacity="0.3"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGrid)"></rect>
              <g stroke="#35f2a0" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.35">
                <line x1="20%" y1="22%" x2="42%" y2="40%"></line>
                <line x1="42%" y1="40%" x2="58%" y2="20%"></line>
                <line x1="42%" y1="40%" x2="68%" y2="58%"></line>
                <line x1="68%" y1="58%" x2="88%" y2="35%"></line>
              </g>
              <circle cx="20%" cy="22%" r="4.5" fill="#35f2a0"></circle>
              <circle cx="42%" cy="40%" r="7" fill="#35f2a0" fillOpacity="0.9"></circle>
              <circle cx="58%" cy="20%" r="4" fill="#c1c4ec"></circle>
              <circle cx="68%" cy="58%" r="6" fill="#FF5C67"></circle>
              <circle cx="88%" cy="35%" r="4.5" fill="#35f2a0"></circle>
            </svg>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Teks Utama Hero */}
            <div className="lg:col-span-7 flex flex-col gap-4 animate-fade-in-up">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] font-extrabold">
                Lihat <span className="text-primary-container underline decoration-primary-container/40 underline-offset-8">Jaringan</span> di Balik Setiap Risiko Kesehatan.
              </h1>
              
              <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
                JAGA adalah platform intelijen berdaulat yang dirancang untuk mengungkap anomali terkoordinasi di antara peserta, dokter, fasilitas kesehatan, dan klaim — membongkar sindikat kecurangan kolusif yang tidak pernah bisa dideteksi oleh audit transaksi individu.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#cockpit"
                  onClick={(e) => scrollToSection(e, 'cockpit')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-[#48f7af] to-[#28d98b] text-[#080B24] font-headline text-xs font-bold border-t border-white/40 border-b-2 border-[#189b60] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Lihat Kokpit Langsung</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
                <a
                  href="#pillars"
                  onClick={(e) => scrollToSection(e, 'pillars')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-[#1f254e] to-[#121636] border-t border-white/15 border-b-2 border-[#090c23] text-white font-body text-xs font-semibold hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary-container">hub</span>
                  <span>Jelajahi 4 Layer AI</span>
                </a>
              </div>

              {/* Lencana Kepercayaan */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-outline-variant/30 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-container text-[16px]">verified</span>
                  <span className="font-mono text-on-surface-variant">Patuhi UU PDP</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-container text-[16px]">account_tree</span>
                  <span className="font-mono text-on-surface-variant">AI Graf Relasional</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-container text-[16px]">shield_person</span>
                  <span className="font-mono text-on-surface-variant">Pengawasan Manusia</span>
                </div>
              </div>
            </div>

            {/* Panel Melayang HUD Dossier */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-surface-container-low border border-outline-variant/40 rounded-xl p-5 border-t border-white/10">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container">
                    <span className="font-mono text-[10px] text-primary-accent uppercase tracking-wider font-semibold">DOSIER JARINGAN</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-error-container/60 border border-error/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-error"></div>
                    <span className="font-mono text-[10px] text-error font-bold tracking-wider">SINDIKAT KOLUSI TERINDIKASI</span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">Nodus Faskes Target</span>
                      <h3 className="font-headline text-lg text-white font-bold">Rumah Sakit Citra Kasih X</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-3xl font-bold text-error">87</span>
                      <span className="font-mono text-xs text-on-surface-variant">/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-surface-container rounded-lg border border-outline-variant/20">
                    <div>
                      <span className="font-mono text-[10px] text-on-surface-variant block">Peserta</span>
                      <span className="font-mono text-xs font-bold text-white">42 NIK</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-on-surface-variant block">Dokter</span>
                      <span className="font-mono text-xs font-bold text-white">3 SIP</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-on-surface-variant block">Paparan Klaim</span>
                      <span className="font-mono text-xs font-bold text-error">Rp 4,8 M</span>
                    </div>
                  </div>
                </div>

                {/* Vektor Atribusi Risiko */}
                <div className="space-y-2 pt-1 pb-3 text-xs">
                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-on-surface-variant">Konsentrasi Corong Rujukan</span>
                      <span className="text-primary-container font-bold">+24 poin</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-on-surface-variant">Duplikasi Leksikal Diagnosis Lintas Klaim</span>
                      <span className="text-primary-container font-bold">+21 poin</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-mono text-[11px] mb-1">
                      <span className="text-on-surface-variant">Anomali Motif Triadika Graf</span>
                      <span className="text-primary-container font-bold">+18 poin</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>

                <a
                  href="#cockpit"
                  onClick={(e) => scrollToSection(e, 'cockpit')}
                  className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-b from-[#48f7af] to-[#28d98b] text-[#080B24] font-headline text-xs font-bold border-t border-white/40 border-b-2 border-[#189b60] flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Inspeksi Topologi Sindikat</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 02. SEKSI PERGESERAN PARADIGMA STRUKTURAL   */}
        {/* ========================================== */}
        <section className="w-full bg-[#0D1130] px-4 md:px-8 py-16 border-b border-outline-variant/20 scroll-mt-16" id="paradigm">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs text-primary-accent uppercase tracking-widest font-semibold">PERGESERAN PARADIGMA STRUKTURAL</span>
              <h2 className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight mt-1">
                Kecurangan tidak tampak mencurigakan secara mandiri. <br className="hidden sm:block"/>
                <span className="text-primary-container">Polanya hanya muncul di dalam jaringan.</span>
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-2 leading-relaxed">
                Klaim individu lolos audit berbasis aturan dengan kepatuhan sempurna. Namun saat dipetakan dalam vektor relasional, aktivitas yang tersebar mengungkap sindikat kecurangan yang terkoordinasi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Audit Transaksi Terisolasi (Legacy) */}
              <div className="lg:col-span-5 bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <span className="font-mono text-xs text-on-surface-variant font-bold">AUDIT LAMA: AUDIT TRANSAKSI TERISOLASI</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px]">LOLOS AUDIT</span>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant mt-3 leading-relaxed">
                    Klaim ditinjau secara terpisah. Batas tarif, kode diagnosis, dan tanggal terlihat sah, sehingga sindikat klaim rekaan beroperasi di bawah ambang batas deteksi.
                  </p>

                  <div className="space-y-2 mt-4">
                    <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                        <div>
                          <div className="font-mono font-bold text-white text-[11px]">KLAIM #10291 • Rp 5.000.000</div>
                          <div className="text-on-surface-variant text-[10px]">Dr. S***, Sp.PD — Terverifikasi & Disetujui</div>
                        </div>
                      </div>
                      <span className="text-primary-container font-mono text-[10px] font-bold">LOLOS 100%</span>
                    </div>

                    <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                        <div>
                          <div className="font-mono font-bold text-white text-[11px]">KLAIM #10292 • Rp 4.900.000</div>
                          <div className="text-on-surface-variant text-[10px]">Dr. S***, Sp.PD — Terverifikasi & Disetujui</div>
                        </div>
                      </div>
                      <span className="text-primary-container font-mono text-[10px] font-bold">LOLOS 100%</span>
                    </div>

                    <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                        <div>
                          <div className="font-mono font-bold text-white text-[11px]">KLAIM #10293 • Rp 5.100.000</div>
                          <div className="text-on-surface-variant text-[10px]">Dr. R***, Sp.A — Terverifikasi & Disetujui</div>
                        </div>
                      </div>
                      <span className="text-primary-container font-mono text-[10px] font-bold">LOLOS 100%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 mt-4 text-[11px] font-mono text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                  <span>Hasil: Tidak ada anomali sistemik terdeteksi. Dana dicairkan.</span>
                </div>
              </div>

              {/* Rekonstruksi Graf JAGA */}
              <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-5 border border-primary-container/30 relative flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <span className="font-mono text-xs text-error font-bold uppercase">REKONSTRUKSI GRAF RELASIONAL JAGA</span>
                    <span className="px-2 py-0.5 rounded bg-error-container/60 border border-error/40 text-error font-mono text-[10px] font-bold">KOLUSI TERDETEKSI</span>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant mt-3 leading-relaxed">
                    Diproyeksikan pada nodus yang terhubung, stempel waktu IP yang terkolerasi, rujukan silang dokter, dan kloning diagnosis mengungkap 42 klaim sebagai sindikat terorganisir.
                  </p>

                  {/* Graf Dinamis SVG */}
                  <div className="mt-4 p-3 rounded-lg bg-[#080B24] border border-outline-variant/30 h-44 relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 520 160">
                      <defs>
                        <linearGradient id="edgeGlow" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#35F2A0" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="#FF5C67" stopOpacity="0.9"></stop>
                        </linearGradient>
                      </defs>
                      {/* Edges */}
                      <line x1="80" y1="40" x2="240" y2="80" stroke="url(#edgeGlow)" strokeWidth="1.8"></line>
                      <line x1="80" y1="80" x2="240" y2="80" stroke="url(#edgeGlow)" strokeWidth="1.8"></line>
                      <line x1="80" y1="120" x2="240" y2="80" stroke="url(#edgeGlow)" strokeWidth="1.8"></line>
                      <line x1="240" y1="80" x2="420" y2="50" stroke="#FF5C67" strokeWidth="2.5" strokeDasharray="4 2"></line>
                      <line x1="240" y1="80" x2="420" y2="110" stroke="#FF5C67" strokeWidth="2.5" strokeDasharray="4 2"></line>
                      {/* Patient Nodes */}
                      <circle cx="80" cy="40" r="7" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                      <circle cx="80" cy="80" r="7" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                      <circle cx="80" cy="120" r="7" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                      <text x="35" y="84" fill="#9ca7c5" fontFamily="JetBrains Mono" fontSize="9">42 Peserta</text>
                      {/* Doctors Node */}
                      <circle cx="240" cy="80" r="15" fill="#481016" stroke="#FF5C67" strokeWidth="2"></circle>
                      <text x="240" y="84" fill="#ffffff" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" textAnchor="middle">3 Dr (SIP)</text>
                      {/* Target Provider & Pharmacy */}
                      <circle cx="420" cy="50" r="14" fill="#1C2248" stroke="#FF5C67" strokeWidth="2"></circle>
                      <circle cx="420" cy="50" r="18" fill="none" stroke="#FF5C67" strokeWidth="1" strokeDasharray="3 3"></circle>
                      <text x="445" y="54" fill="#FF5C67" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold">RS CITRA (Terindikasi)</text>
                      <circle cx="420" cy="110" r="11" fill="#1C2248" stroke="#FF5C67" strokeWidth="1.5"></circle>
                      <text x="442" y="114" fill="#c1c4ec" fontFamily="JetBrains Mono" fontSize="9">Apotek X-9</text>
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-2 rounded bg-surface-container border border-outline-variant/20">
                      <span className="font-mono text-[10px] text-on-surface-variant block">Kemiripan Leksikal Rekam Medis</span>
                      <span className="font-mono text-xs text-error font-bold">87,4% Identik (ICD-10 M54.5)</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container border border-outline-variant/20">
                      <span className="font-mono text-[10px] text-on-surface-variant block">Lonjakan Stempel Waktu</span>
                      <span className="font-mono text-xs text-error font-bold">Suksesi Cepat 12 Detik</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 mt-4 text-[11px] font-mono text-primary-accent flex items-center justify-between">
                  <span>Keputusan: Rp 4,8 Miliar dicegat sebelum pencairan</span>
                  <span className="font-bold text-primary-container">Penyelamatan Pra-Pencairan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 03. SEKSI ARSITEKTUR TINGKAT PERTAHANAN    */}
        {/* ========================================== */}
        <section className="w-full bg-[#080B24] px-4 md:px-8 py-16 border-b border-outline-variant/20 scroll-mt-16" id="pillars">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            <div className="max-w-2xl">
              <span className="font-mono text-xs text-primary-accent uppercase tracking-widest font-semibold">ARSITEKTUR TINGKAT PERTAHANAN</span>
              <h2 className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight mt-1">
                Dirancang untuk penemuan risiko berdimensi tinggi.
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-2 leading-relaxed">
                Empat pilar intelijen terkalibrasi yang menggabungkan graf topologi multi-tingkat, ansambel statistik, atribusi terjelaskan, dan umpan balik aktif real-time.
              </p>
            </div>

            {/* Grid 4 Kartu Pilar Isometrik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* PILAR 01: Topologi Graf */}
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between group shadow-lg transform hover:-translate-y-1">
                <div>
                  <div className="w-full h-40 bg-[#080B24] rounded-lg border border-outline-variant/30 mb-4 overflow-hidden relative flex items-center justify-center p-2">
                    <svg className="w-full h-full max-h-36" viewBox="0 0 240 160">
                      <defs>
                        <linearGradient id="isoPlaneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1C2248" stopOpacity="0.8"></stop>
                          <stop offset="100%" stopColor="#0D1130" stopOpacity="0.9"></stop>
                        </linearGradient>
                        <linearGradient id="isoEdgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#35F2A0"></stop>
                          <stop offset="100%" stopColor="#8BFFCE"></stop>
                        </linearGradient>
                      </defs>
                      <g transform="translate(120, 30)">
                        <polygon points="0,45 80,90 0,135 -80,90" fill="url(#isoPlaneGrad1)" stroke="#2c345b" strokeWidth="1"></polygon>
                        <line x1="-40" y1="67.5" x2="40" y2="112.5" stroke="#2c345b" strokeWidth="0.7" strokeDasharray="2 2"></line>
                        <line x1="40" y1="67.5" x2="-40" y2="112.5" stroke="#2c345b" strokeWidth="0.7" strokeDasharray="2 2"></line>
                        <polygon points="0,10 75,52 0,94 -75,52" fill="#131735" fillOpacity="0.75" stroke="#35F2A0" strokeWidth="1.2" strokeOpacity="0.6"></polygon>
                        <line x1="0" y1="10" x2="0" y2="45" stroke="#35F2A0" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5"></line>
                        <line x1="75" y1="52" x2="80" y2="90" stroke="#35F2A0" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5"></line>
                        <line x1="-75" y1="52" x2="-80" y2="90" stroke="#35F2A0" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5"></line>
                        <line x1="-35" y1="50" x2="0" y2="35" stroke="url(#isoEdgeGlow)" strokeWidth="2"></line>
                        <line x1="0" y1="35" x2="40" y2="60" stroke="url(#isoEdgeGlow)" strokeWidth="2"></line>
                        <line x1="0" y1="35" x2="5" y2="70" stroke="#FF5C67" strokeWidth="2" strokeDasharray="3 2"></line>
                        <line x1="-35" y1="50" x2="5" y2="70" stroke="url(#isoEdgeGlow)" strokeWidth="1.5"></line>
                        <circle cx="-35" cy="50" r="5" fill="#35F2A0"></circle>
                        <circle cx="0" cy="35" r="7" fill="#8BFFCE" stroke="#080B24" strokeWidth="1.5"></circle>
                        <circle cx="40" cy="60" r="5.5" fill="#35F2A0"></circle>
                        <circle cx="5" cy="70" r="9" fill="#FF5C67" fillOpacity="0.3"></circle>
                        <circle cx="5" cy="70" r="6" fill="#FF5C67" stroke="#ffffff" strokeWidth="1.5"></circle>
                      </g>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-primary-container text-xs font-bold">PILAR 01</span>
                    <span className="font-mono text-on-surface-variant text-[10px]">APACHE AGE</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1">Topologi Tingkat Jaringan</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    Graf pengetahuan heterogen dinamis yang menghubungkan peserta, tenaga medis, faskes, dan kode klaim untuk membongkar sindikat multi-titik.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 font-mono text-[10px] text-primary-accent uppercase tracking-wider">
                  Proyeksi Relasional Mendalam
                </div>
              </div>

              {/* PILAR 02: Konsensus AI Berlapis */}
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between group shadow-lg transform hover:-translate-y-1">
                <div>
                  <div className="w-full h-40 bg-[#080B24] rounded-lg border border-outline-variant/30 mb-4 overflow-hidden relative flex items-center justify-center p-2">
                    <svg className="w-full h-full max-h-36" viewBox="0 0 240 160">
                      <defs>
                        <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#35F2A0" stopOpacity="0.85"></stop>
                          <stop offset="100%" stopColor="#1C2248" stopOpacity="0.9"></stop>
                        </linearGradient>
                      </defs>
                      <g transform="translate(120, 25)">
                        <polygon points="0,75 60,105 0,135 -60,105" fill="#1C2248" stroke="#2c345b" strokeWidth="1"></polygon>
                        <polygon points="60,105 60,113 0,143 0,135" fill="#0D1130"></polygon>
                        <polygon points="-60,105 -60,113 0,143 0,135" fill="#080B24"></polygon>
                        <text x="0" y="112" fill="#9ca7c5" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">L1 • REGULASI</text>
                        <polygon points="0,50 55,77 0,104 -55,77" fill="#222749" stroke="#3b4a40" strokeWidth="1"></polygon>
                        <polygon points="55,77 55,83 0,110 0,104" fill="#131735"></polygon>
                        <text x="0" y="84" fill="#c6ffda" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">L2 • STATISTIK</text>
                        <polygon points="0,25 50,50 0,75 -50,50" fill="#283060" stroke="#35F2A0" strokeWidth="1"></polygon>
                        <text x="0" y="56" fill="#8BFFCE" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">L3 • GRAF</text>
                        <polygon points="0,2 45,24 0,46 -45,24" fill="url(#cubeTop)" stroke="#ffffff" strokeWidth="1.2"></polygon>
                        <text x="0" y="28" fill="#080B24" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle">L4 • GBDT</text>
                        <circle cx="20" cy="18" r="3" fill="#ffffff"></circle>
                        <line x1="20" y1="18" x2="20" y2="105" stroke="#35F2A0" strokeWidth="1" strokeDasharray="2 2"></line>
                        <circle cx="-15" cy="35" r="2.5" fill="#FF5C67"></circle>
                        <line x1="-15" y1="35" x2="-15" y2="120" stroke="#FF5C67" strokeWidth="1" strokeDasharray="2 2"></line>
                      </g>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-primary-container text-xs font-bold">PILAR 02</span>
                    <span className="font-mono text-on-surface-variant text-[10px]">ANSAMBEL</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1">Konsensus AI Berlapis</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    Menggabungkan aturan hukum deterministik, matriks anomali statistik tanpa pengawasan, dan model GBDT ke dalam satu skor terbobot.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 font-mono text-[10px] text-primary-accent uppercase tracking-wider">
                  Fusi Algoritma 4 Tingkat
                </div>
              </div>

              {/* PILAR 03: Atribusi Terjelaskan */}
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between group shadow-lg transform hover:-translate-y-1">
                <div>
                  <div className="w-full h-40 bg-[#080B24] rounded-lg border border-outline-variant/30 mb-4 overflow-hidden relative flex items-center justify-center p-2">
                    <svg className="w-full h-full max-h-36" viewBox="0 0 240 160">
                      <defs>
                        <linearGradient id="hudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1C2248" stopOpacity="0.95"></stop>
                          <stop offset="100%" stopColor="#0D1130" stopOpacity="0.85"></stop>
                        </linearGradient>
                      </defs>
                      <g transform="translate(120, 35)">
                        <polygon points="0,5 75,45 0,90 -75,45" fill="url(#hudGrad)" stroke="#35F2A0" strokeWidth="1.2"></polygon>
                        <polygon points="75,45 75,52 0,97 0,90" fill="#0D1130"></polygon>
                        <polygon points="-75,45 -75,52 0,97 0,90" fill="#080B24"></polygon>
                        <polygon points="-30,30 -22,26 -22,12 -30,16" fill="#35F2A0"></polygon>
                        <polygon points="-22,26 -14,30 -14,16 -22,12" fill="#8BFFCE"></polygon>
                        <polygon points="-30,16 -22,12 -14,16 -22,20" fill="#c6ffda"></polygon>
                        <text x="-22" y="8" fill="#35F2A0" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle">+24</text>
                        <polygon points="-5,44 3,40 3,28 -5,32" fill="#35F2A0"></polygon>
                        <polygon points="3,40 11,44 11,32 3,28" fill="#8BFFCE"></polygon>
                        <polygon points="-5,32 3,28 11,32 3,36" fill="#c6ffda"></polygon>
                        <text x="3" y="24" fill="#35F2A0" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle">+21</text>
                        <polygon points="20,58 28,54 28,45 20,49" fill="#FF5C67"></polygon>
                        <polygon points="28,54 36,58 36,49 28,45" fill="#ffb4ab"></polygon>
                        <polygon points="20,49 28,45 36,49 28,53" fill="#ffdad6"></polygon>
                        <text x="28" y="41" fill="#FF5C67" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle">+18</text>
                        <ellipse cx="-20" cy="58" rx="14" ry="7" fill="none" stroke="#35F2A0" strokeWidth="0.8" strokeDasharray="2 2"></ellipse>
                        <circle cx="-20" cy="58" r="2.5" fill="#35F2A0"></circle>
                      </g>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-primary-container text-xs font-bold">PILAR 03</span>
                    <span className="font-mono text-on-surface-variant text-[10px]">MATRIKS SHAP</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1">Atribusi AI Terjelaskan</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    Tanpa transparansi kotak hitam. Skor risiko yang terdeteksi diurai menjadi poin pembuktian siap sidang dan sitasi protokol regulasi.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 font-mono text-[10px] text-primary-accent uppercase tracking-wider">
                  Kejelasan Pembuktian Hukum
                </div>
              </div>

              {/* PILAR 04: Pembelajaran Aktif Berkelanjutan */}
              <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/40 hover:border-primary-container/40 transition-all duration-300 flex flex-col justify-between group shadow-lg transform hover:-translate-y-1">
                <div>
                  <div className="w-full h-40 bg-[#080B24] rounded-lg border border-outline-variant/30 mb-4 overflow-hidden relative flex items-center justify-center p-2">
                    <svg className="w-full h-full max-h-36" viewBox="0 0 240 160">
                      <defs>
                        <linearGradient id="flywheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#35F2A0"></stop>
                          <stop offset="50%" stopColor="#1C2248"></stop>
                          <stop offset="100%" stopColor="#FF5C67"></stop>
                        </linearGradient>
                      </defs>
                      <g transform="translate(120, 50)">
                        <ellipse cx="0" cy="20" rx="75" ry="38" fill="none" stroke="#2c345b" strokeWidth="1.5"></ellipse>
                        <path d="M -65,25 A 75,38 0 0,0 55,38" fill="none" stroke="url(#flywheelGrad)" strokeWidth="3" strokeLinecap="round"></path>
                        <path d="M 55,38 A 75,38 0 0,0 -20,-17" fill="none" stroke="#35F2A0" strokeWidth="2" strokeDasharray="4 3"></path>
                        <circle cx="-65" cy="25" r="5" fill="#35F2A0"></circle>
                        <circle cx="0" cy="58" r="7" fill="#8BFFCE" stroke="#080B24" strokeWidth="1.5"></circle>
                        <circle cx="55" cy="38" r="5" fill="#FF5C67"></circle>
                        <circle cx="-20" cy="-17" r="4.5" fill="#c1c4ec"></circle>
                        <polygon points="0,5 25,18 0,31 -25,18" fill="#1C2248" stroke="#35F2A0" strokeWidth="1"></polygon>
                        <polygon points="25,18 25,28 0,41 0,31" fill="#0D1130"></polygon>
                        <polygon points="-25,18 -25,28 0,41 0,31" fill="#080B24"></polygon>
                        <circle cx="0" cy="18" r="3.5" fill="#35F2A0"></circle>
                        <circle cx="0" cy="18" r="3" fill="#ffffff"></circle>
                        <text x="0" y="78" fill="#9ca7c5" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">UMPAN BALIK PEMBELAJARAN AKTIF</text>
                      </g>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-primary-container text-xs font-bold">PILAR 04</span>
                    <span className="font-mono text-on-surface-variant text-[10px]">IKATAN TERTUTUP</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1">Pembelajaran Aktif Berkelanjutan</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    Keputusan investigator secara langsung mengkalibrasi filter positif palsu dan bobot hubungan graf tanpa henti sistem (*downtime*).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/30 font-mono text-[10px] text-primary-accent uppercase tracking-wider">
                  Kalibrasi Bobot Otonom
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 04. SEKSI PRATINJAU KOKPIT INVESTIGASI     */}
        {/* ========================================== */}
        <section className="w-full bg-[#0D1130] px-4 md:px-8 py-16 border-b border-outline-variant/20 scroll-mt-16" id="cockpit">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-primary-accent uppercase tracking-widest font-semibold">MEJA INVESTIGASI TINGKAT OPERASIONAL</span>
                <h2 className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight mt-1">
                  Dibangun untuk investigator. <span className="text-primary-container">Bukan otomatisasi kotak hitam.</span>
                </h2>
                <p className="font-body text-sm text-on-surface-variant mt-1.5">
                  Kokpit triase operasional yang mengintegrasikan subgraf relasional, bukti bahasa alami, dan keputusan manusia yang tersertifikasi.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span>ANTREAN LANGSUNG • KASUS #JAGA-{selectedCase}</span>
              </div>
            </div>

            {/* Komponen Kokpit Terintegrasi */}
            <div className="w-full bg-surface-container rounded-xl border border-outline-variant/40 shadow-2xl overflow-hidden">
              {/* Header Jendela Kokpit */}
              <div className="h-10 bg-[#080B24] px-4 flex items-center justify-between border-b border-outline-variant/30 text-xs">
                <div className="flex items-center gap-2 font-mono text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                  <span className="ml-2 font-semibold text-white">JAGA // KOKPIT TRIASE TAKTIS</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 font-mono text-on-surface-variant text-[11px]">
                  <span>OPERATOR: ID-JKN-8812</span>
                  <span>IZIN: TINGKAT-4</span>
                  <span className="text-primary-container">LATENSI: 12ms</span>
                </div>
              </div>

              {/* Konten Kokpit 3 Kolom */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                {/* Kolom 1: Antrean Prioritas (4 Kolom) */}
                <div className="lg:col-span-4 bg-surface-container-low border-r border-outline-variant/30 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/20">
                      <span className="font-headline text-xs font-bold text-white uppercase tracking-wider">Sindikat Prioritas</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-error-container/60 text-error font-bold">3 KRITIS</span>
                    </div>

                    <div className="space-y-2">
                      {cases.map((c) => {
                        const isSelected = c.id === selectedCase
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedCase(c.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-surface-container-high border-primary-container/40 shadow-sm'
                                : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-mono text-[11px] font-bold ${isSelected ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                                #JAGA-{c.id}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                                c.risk >= 90 ? 'bg-error/20 text-error' : c.risk >= 80 ? 'bg-error-container/40 text-error' : 'bg-surface-container-highest text-secondary'
                              }`}>
                                {c.risk}/100 RISIKO
                              </span>
                            </div>
                            <h4 className="font-headline text-xs text-white font-bold mt-1">{c.title}</h4>
                            <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{c.subtitle}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20 text-[11px] font-mono">
                              <span className="text-on-surface-variant">Paparan:</span>
                              <span className={`font-bold ${isSelected ? 'text-primary-container' : 'text-white'}`}>{c.exposure}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 text-[11px] font-mono text-on-surface-variant flex items-center justify-between">
                    <span>Menampilkan 3 dari 142 Sindikat</span>
                    <span className="text-primary-container">Diperbarui Otomatis</span>
                  </div>
                </div>

                {/* Kolom 2: Visualisator Subgraf (5 Kolom) */}
                <div className="lg:col-span-5 bg-[#080B24] p-4 flex flex-col justify-between relative border-r border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/20">
                      <span className="font-mono text-xs text-white uppercase">Proyeksi Subgraf (Kasus #{selectedCase})</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        <span className="font-mono text-[10px] text-error font-bold">MOTIF SIKLIK</span>
                      </div>
                    </div>

                    {/* Preview Topologi SVG */}
                    <div className="h-64 w-full relative flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 340 220">
                        {/* Garis Hubungan */}
                        <line x1="60" y1="50" x2="160" y2="100" stroke="#3b4a40" strokeWidth="1.5"></line>
                        <line x1="60" y1="110" x2="160" y2="100" stroke="#3b4a40" strokeWidth="1.5"></line>
                        <line x1="60" y1="170" x2="160" y2="100" stroke="#3b4a40" strokeWidth="1.5"></line>
                        <line x1="160" y1="100" x2="260" y2="60" stroke="#FF5C67" strokeWidth="2" strokeDasharray="3 2"></line>
                        <line x1="160" y1="100" x2="260" y2="150" stroke="#FF5C67" strokeWidth="2" strokeDasharray="3 2"></line>
                        <line x1="260" y1="60" x2="260" y2="150" stroke="#FF5C67" strokeWidth="1.5" strokeDasharray="2 2"></line>
                        {/* Nodus */}
                        <circle cx="60" cy="50" r="10" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                        <text x="60" y="53" fill="#c6ffda" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">NIK-1</text>
                        <circle cx="60" cy="110" r="10" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                        <text x="60" y="113" fill="#c6ffda" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">NIK-2</text>
                        <circle cx="60" cy="170" r="10" fill="#1C2248" stroke="#35F2A0" strokeWidth="1.5"></circle>
                        <text x="60" y="173" fill="#c6ffda" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">NIK-3</text>
                        {/* Nodus Dokter */}
                        <circle cx="160" cy="100" r="16" fill="#481016" stroke="#FF5C67" strokeWidth="2"></circle>
                        <text x="160" y="103" fill="#ffffff" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" textAnchor="middle">12 DR</text>
                        {/* Nodus Faskes & Lab */}
                        <circle cx="260" cy="60" r="18" fill="#1C2248" stroke="#FF5C67" strokeWidth="2"></circle>
                        <text x="260" y="63" fill="#FF5C67" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle">KLINIK-M</text>
                        <circle cx="260" cy="150" r="14" fill="#1C2248" stroke="#FF5C67" strokeWidth="1.5"></circle>
                        <text x="260" y="153" fill="#e4e7ff" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">LAB-7</text>
                      </svg>
                    </div>
                  </div>

                  {/* Metrik HUD Ringkas */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded bg-surface-container border border-outline-variant/30 text-center font-mono text-[11px]">
                    <div>
                      <span className="text-on-surface-variant text-[10px] block">Entitas</span>
                      <span className="text-white font-bold">46 Total</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[10px] block">Ko-eksistensi</span>
                      <span className="text-error font-bold">91,4%</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-[10px] block">Rentang Waktu</span>
                      <span className="text-primary-container font-bold">14 Hari</span>
                    </div>
                  </div>
                </div>

                {/* Kolom 3: Sintesis AI & Tindakan Manusia (3 Kolom) */}
                <div className="lg:col-span-3 bg-surface-container-low p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/20">
                      <span className="font-headline text-xs font-bold text-white uppercase tracking-wider">Sintesis AI</span>
                      <span className="font-mono text-[10px] text-primary-container bg-surface-container px-1.5 py-0.5 rounded">AGEN GENAI</span>
                    </div>

                    <div className="p-2.5 rounded bg-surface-container border border-outline-variant/20 text-xs leading-relaxed space-y-2">
                      <span className="font-mono text-[11px] text-primary-accent font-semibold block">Temuan Sistem:</span>
                      <p className="text-on-surface-variant text-[11px]">
                        {activeCase.finding}
                      </p>
                    </div>

                    <div className="space-y-1.5 mt-3 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-error">
                        <span className="material-symbols-outlined text-[15px]">cancel</span>
                        <span>100% Cocok IP Bersama</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-error">
                        <span className="material-symbols-outlined text-[15px]">cancel</span>
                        <span>Anomali lonjakan stempel waktu</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary-container">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        <span>Tanpa riwayat klinis sebelumnya</span>
                      </div>
                    </div>
                  </div>

                  {/* Tindakan Manusia */}
                  <div className="pt-4 space-y-2 border-t border-outline-variant/20 mt-4">
                    <button
                      onClick={() => navigate(`/network/${selectedCase}`)}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-b from-[#ff6b75] to-[#e0434f] text-white font-headline text-xs font-bold border-t border-white/30 border-b-2 border-[#a3222d] flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">pause_circle</span>
                      <span>Bekukan Pencairan ({activeCase.exposure})</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/network/${selectedCase}`)}
                        className="py-1.5 px-2 rounded-lg bg-gradient-to-b from-[#222852] to-[#131738] border-t border-white/15 border-b-2 border-[#090c23] text-white text-[11px] font-semibold hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Ajukan Audit
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="py-1.5 px-2 rounded-lg bg-gradient-to-b from-[#1c2146] to-[#0f1330] border-t border-white/10 border-b-2 border-[#080b20] text-on-surface-variant hover:text-white text-[11px] font-semibold hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        Abaikan Peringatan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 05. SEKSI METRIK DAMPAK KEDAULATAN        */}
        {/* ========================================== */}
        <section className="w-full bg-[#080B24] px-4 md:px-8 py-14 border-b border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/30 transition-all">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">PERLINDUNGAN POPULASI</span>
                <div className="font-headline text-3xl sm:text-4xl font-bold text-white mt-1">240 Juta+</div>
                <p className="font-body text-xs text-primary-accent mt-1">Warga Terlindungi dari Pencurian Identitas</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/30 transition-all">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">PENGAWASAN ANGGARAN TAHUNAN</span>
                <div className="font-headline text-3xl sm:text-4xl font-bold text-primary-container mt-1">~Rp 150T</div>
                <p className="font-body text-xs text-on-surface-variant mt-1">Anggaran Kesehatan Berdaulat JKN</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/30 transition-all">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">KECEPATAN INVESTIGATOR</span>
                <div className="font-headline text-3xl sm:text-4xl font-bold text-white mt-1">2,0×</div>
                <p className="font-body text-xs text-primary-accent mt-1">Lebih Cepat Resolusi Audit</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/30 transition-all">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">STANDAR REGULASI</span>
                <div className="font-headline text-3xl sm:text-4xl font-bold text-white mt-1">UU PDP</div>
                <p className="font-body text-xs text-primary-accent mt-1">Kepatuhan Kriptografi Ketat</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 06. SEKSI PRIVASI BERDAULAT & INFRASTRUKTUR*/}
        {/* ========================================== */}
        <section className="w-full bg-[#0D1130] px-4 md:px-8 py-16 border-b border-outline-variant/20 scroll-mt-16" id="security">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs text-primary-accent uppercase tracking-widest font-semibold">PRIVASI BERDAULAT & INFRASTRUKTUR</span>
              <h2 className="font-headline text-2xl sm:text-3xl text-white font-extrabold tracking-tight mt-1">
                Dirancang untuk data kesehatan publik yang sensitif.
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-2 leading-relaxed">
                Kepatuhan ketat terhadap UU No. 27/2022 (UU PDP), menjamin tanpa kebocoran identitas, audit kriptografis, dan pemrosesan graf Apache AGE berkapasitas tinggi.
              </p>
            </div>

            {/* Grid Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bento 1 */}
              <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary-container mb-3">
                    <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                    <span className="font-mono text-xs font-bold uppercase">PRIVASI KRIPTOGRAFI</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1.5">Pseudonimisasi SHA-256</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    NIK peserta dan SIP dokter dienkripsi dengan hash permanen sebelum masuk ke dalam graf. Re-identifikasi memerlukan izin pengadilan bersertifikat.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[10px] font-mono text-primary-accent">
                  PATUHI PASAL 16 UU PDP
                </div>
              </div>

              {/* Bento 2 */}
              <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary-container mb-3">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                    <span className="font-mono text-xs font-bold uppercase">INFRASTRUKTUR GRAF</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1.5">Apache AGE + Klaster Ray</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    Graf properti skala besar yang mampu mengueri 500 Juta+ nodus heterogen dengan deteksi siklik sub-detik dan penemuan komunitas real-time.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[10px] font-mono text-primary-accent">
                  RUNTIME EKSTENSI POSTGRESQL
                </div>
              </div>

              {/* Bento 3 */}
              <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary-container/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary-container mb-3">
                    <span className="material-symbols-outlined text-[20px]">gavel</span>
                    <span className="font-mono text-xs font-bold uppercase">JAMINAN TATA KELOLA</span>
                  </div>
                  <h3 className="font-headline text-base text-white font-bold mb-1.5">Tanpa Sanksi Kotak Hitam</h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    JAGA beroperasi penuh sebagai kokpit pendukung keputusan. Tidak ada penentuan algoritma yang dapat membekukan dana tanpa otorisasi investigator bersertifikat.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[10px] font-mono text-primary-accent">
                  MANDAT HAK AKSES MINIMUM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 07. SEKSI AJAKAN BERTINDAK (CALL TO ACTION) */}
        {/* ========================================== */}
        <section className="relative w-full bg-[#080B24] px-4 md:px-8 py-16 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50%" cy="50%" r="240" fill="none" stroke="#35F2A0" strokeWidth="1" strokeDasharray="6 4"></circle>
              <circle cx="50%" cy="50%" r="380" fill="none" stroke="#35F2A0" strokeWidth="0.8" strokeOpacity="0.4"></circle>
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <h2 className="font-headline text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
              Kecurangan berkembang. <br/>
              <span className="text-primary-container">Sistem pengawasan Anda pun harus begitu.</span>
            </h2>

            <p className="font-body text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Beralih ke intelijen risiko jaringan tingkat pertahanan untuk melindungi sumber daya kesehatan berdaulat, menghentikan kebocoran sistemik, dan membekali investigator dengan bukti siap sidang.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#48f7af] to-[#28d98b] text-[#080B24] font-headline text-xs font-bold border-t border-white/40 border-b-2 border-[#189b60] hover:brightness-105 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Jelajahi Kokpit JAGA</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="#pillars"
                onClick={(e) => scrollToSection(e, 'pillars')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#1f254e] to-[#121636] border-t border-white/15 border-b-2 border-[#090c23] text-white font-body text-xs font-semibold hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-primary-container">layers</span>
                <span>Lihat Arsitektur</span>
              </a>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] text-on-surface-variant">
              <span>PATUHI UU PDP NO. 27/2022</span>
              <span>•</span>
              <span>DE-IDENTIFIKASI KRIPTOGRAFI</span>
              <span>•</span>
              <span>PENGAWASAN MANUSIA MANDATORI</span>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================== */}
      {/* FOOTER GELAP                               */}
      {/* ========================================== */}
      <footer className="w-full bg-[#080B24] border-t border-outline-variant/30 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
              <span className="font-headline text-sm text-white font-extrabold uppercase tracking-tight">JAGA</span>
            </div>
            <span className="text-outline-variant text-xs">•</span>
            <span className="font-body text-xs text-on-surface-variant">Jaringan Analitik Guard Anti-fraud © 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
            <span>STATUS: RUNTIME AKTIF</span>
            <div className="w-2 h-2 rounded-full bg-primary-container"></div>
            <span className="text-primary-accent font-semibold">SIAP UU PDP</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
