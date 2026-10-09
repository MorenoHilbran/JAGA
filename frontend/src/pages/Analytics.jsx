import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Network,
  Activity,
  Layers,
  TrendingUp,
  Download,
  Filter,
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import {
  StatCard,
  JagaCard,
  JagaButton,
  RiskTrendChart,
  SignalBreakdownChart,
  PeerComparisonChart,
  NetworkGraph,
} from '../components'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * Analytics - Macro Healthcare Intelligence & Anomaly Analytics Workbench
 * Phase 6 Cockpit: Combines system-wide risk telemetry, longitudinal trend vector chart,
 * multi-engine signal attribution, peer distribution, and an interactive syndicate network graph sandbox.
 */
const Analytics = () => {
  const navigate = useNavigate()
  const { isDark } = useJagaTheme()

  const [timeRange, setTimeRange] = useState('30D')
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'graph_sandbox' | 'peer_benchmarking'

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35F2A0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35F2A0]" />
            </span>
            <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${isDark ? 'text-[#35F2A0]' : 'text-emerald-700'}`}>
              MACRO ANOMALY BENCHMARK // PHASE 6
            </span>
          </div>
          <h1 className={`text-2xl font-bold font-headline tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analitik Intelijen & Pemodelan Risiko Graf Nasional
          </h1>
          <p className={`text-xs font-mono mt-1 ${isDark ? 'text-[#9CA7C5]' : 'text-slate-500'}`}>
            Sintesis multi-metode: Algoritma Relasional Graf Apache AGE • Konsensus Rule Engine • Anomali Statistik Z-Score
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center p-0.5 rounded-sm border ${isDark ? 'bg-[#0D1130] border-white/8' : 'bg-slate-100 border-slate-200'}`}>
            {['7D', '30D', '90D', 'YTD'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-[2px] transition-all ${
                  timeRange === t
                    ? isDark
                      ? 'bg-[#35F2A0]/15 text-[#35F2A0] font-bold border border-[#35F2A0]/40'
                      : 'bg-white text-emerald-800 font-bold shadow-xs'
                    : isDark
                    ? 'text-[#859588] hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <JagaButton
            variant="tactical"
            size="sm"
            onClick={() => alert('Laporan eksekutif analitik nasional berhasil diekspor (PDF/JSON).')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Intelijen
          </JagaButton>
        </div>
      </div>

      {/* 2. Telemetry KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Total Kluster Terdeteksi"
          value="67"
          suffix="Jaringan"
          caption="Konsolidasi 75 sinyal anomali"
          delta="100% Selesai"
          deltaType="positive"
          variant="signal"
        />
        <StatCard
          label="Nilai Potensi Fraud Nasional"
          value="548.2"
          prefix="Rp "
          suffix="Miliar"
          caption="Klaim berisiko ditandai sistem"
          delta="Audit Prioritas"
          deltaType="danger"
          variant="critical"
        />
        <StatCard
          label="Faskes Provider Terindikasi"
          value="184"
          suffix="RS / Klinik"
          caption="Tersebar di 34 Kedeputian Wilayah"
          delta="Triage Siaga"
          deltaType="neutral"
          variant="high"
        />
        <StatCard
          label="Presisi Konsensus AI"
          value="97.2"
          suffix="%"
          caption="Cross-validation 3 mesin deteksi"
          delta="+2.4% MoM"
          deltaType="positive"
          variant="default"
        />
      </div>

      {/* 3. Navigation View Switcher */}
      <div className={`border-b flex items-center gap-1 overflow-x-auto ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
        {[
          { id: 'overview', label: 'Ringkasan Tren & Atribusi Sinyal', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'graph_sandbox', label: 'Sandbox Sub-Graf Sindikat (Cytoscape.js)', icon: <Network className="w-3.5 h-3.5" /> },
          { id: 'peer_benchmarking', label: 'Distribusi Benchmark Sejawat (Z-Score)', icon: <Activity className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider uppercase border-b-2 transition-all whitespace-nowrap
                ${
                  isActive
                    ? isDark
                      ? 'border-[#35F2A0] text-white font-bold bg-white/[0.03]'
                      : 'border-[#0B945B] text-slate-900 font-bold bg-emerald-50/50'
                    : isDark
                    ? 'border-transparent text-[#859588] hover:text-[#DFE0FF] hover:bg-white/[0.01]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <span className={isActive ? (isDark ? 'text-[#35F2A0]' : 'text-emerald-700') : (isDark ? 'text-[#859588]' : 'text-slate-400')}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. Tab 1: Overview (Charts) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <RiskTrendChart />
          <SignalBreakdownChart />
        </div>
      )}

      {/* 5. Tab 2: Graph Sandbox */}
      {activeTab === 'graph_sandbox' && (
        <div className="space-y-4">
          <JagaCard
            elevation="low"
            title="Eksplorasi Graf Relasional Sindikat Global"
            subtitle="Representasi interaktif topologi jaringan fraud fasilitas kesehatan mitra JKN (Cytoscape Canvas Engine)"
            badge={
              <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border ${isDark ? 'bg-[#35F2A0]/10 border-[#35F2A0]/30 text-[#35F2A0]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                INTERACTIVE GRAPH CANVAS
              </span>
            }
            hudAccents={true}
            bodyClassName="p-4"
          >
            <NetworkGraph networkId="NET-2026-JKN-089" />
          </JagaCard>
        </div>
      )}

      {/* 6. Tab 3: Peer Benchmarking */}
      {activeTab === 'peer_benchmarking' && (
        <div className="space-y-6">
          <PeerComparisonChart peerGroup="Kelompok RSUD Nasional Kelas A/B — Deviasi Z-Score > 3.0σ" />
          <SignalBreakdownChart title="Kontribusi Tipologi Berdasarkan Standar Permenkes No. 16/2019" />
        </div>
      )}
    </div>
  )
}

export default Analytics
