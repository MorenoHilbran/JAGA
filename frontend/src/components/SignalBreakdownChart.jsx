import React from 'react'
import {
  PieChart,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import JagaCard from './JagaCard'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * SignalBreakdownChart - Multi-Method Detection Signal Contribution Breakdown
 * Pure vector horizontal bar & proportion chart showing multi-layer AI consensus weights.
 */
const SignalBreakdownChart = ({
  signals = null,
  title = 'Distribusi Kontribusi Sinyal Deteksi (Multi-Engine Attribution)',
}) => {
  const { isDark } = useJagaTheme()

  const defaultSignals = [
    {
      id: 'cloning',
      name: 'Kloning Berkas & Rekam Medis (Duplicate / Ghost Patient)',
      count: 67,
      percentage: 54.5,
      weight: '0.45',
      color: '#FF5C67',
      ruleId: 'RULE-01-CLONE',
      amountM: 284.5,
      engine: 'Deterministic Rules & Text Similarity',
    },
    {
      id: 'referral',
      name: 'Rujukan Sirkular Tertutup (Circular Referral Loop)',
      count: 24,
      percentage: 24.8,
      weight: '0.35',
      color: '#FF9F43',
      ruleId: 'RULE-02-REFCON',
      amountM: 168.2,
      engine: 'Apache AGE Graph Analytics & Louvain',
    },
    {
      id: 'los',
      name: 'Perpanjangan Hari Rawat Artifisial (Prolonged LOS)',
      count: 7,
      percentage: 12.3,
      weight: '0.12',
      color: '#FFAE66',
      ruleId: 'RULE-03-LOS',
      amountM: 64.1,
      engine: 'Statistical Z-Score vs Peer Median',
    },
    {
      id: 'repeat',
      name: 'Klaim Berulang Prosedur Khusus (Repeat Billing)',
      count: 5,
      percentage: 8.4,
      weight: '0.08',
      color: '#35F2A0',
      ruleId: 'RULE-04-REPEAT',
      amountM: 31.4,
      engine: 'Temporal Frequency Windows',
    },
  ]

  const items = signals || defaultSignals
  const totalCount = items.reduce((acc, it) => acc + it.count, 0)
  const totalAmount = items.reduce((acc, it) => acc + it.amountM, 0)

  return (
    <JagaCard
      elevation="low"
      title={title}
      subtitle="Bobot kontribusi 4 mesin deteksi dalam membentuk skor risiko komposit JKN (Risk Fusion Engine)"
      badge={
        <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border ${isDark ? 'bg-[#35F2A0]/10 border-[#35F2A0]/30 text-[#35F2A0]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          MULTI-LAYER CONSENSUS
        </span>
      }
      hudAccents={true}
      bodyClassName="p-4 space-y-4"
    >
      {/* 1. Stacked Composition Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className={isDark ? 'text-[#859588]' : 'text-slate-500'}>
            PROPORSI SINYAL TERINDIKASI ({totalCount} TOTAL SINYAL)
          </span>
          <span className="font-bold text-[#35F2A0]">
            100% KONSENSUS SELESAI
          </span>
        </div>

        <div className="h-3 w-full rounded-sm overflow-hidden flex bg-black/40 border border-white/8">
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.name}: ${item.percentage}% (${item.count} sinyal)`}
              className="h-full transition-all duration-300 hover:brightness-125"
            />
          ))}
        </div>
      </div>

      {/* 2. Detailed Breakdown Cards */}
      <div className="space-y-2.5 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-sm border transition-all ${
              isDark
                ? 'bg-[#080B24] border-white/6 hover:border-white/15'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className={`text-xs font-bold font-sans ${isDark ? 'text-[#DFE0FF]' : 'text-slate-800'}`}>
                  {item.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-white/5 border border-white/10 text-[#9CA7C5]">
                  {item.ruleId}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.percentage}%
                </span>
                <span className={isDark ? 'text-[#859588]' : 'text-slate-400'}>
                  ({item.count} Sinyal)
                </span>
              </div>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full h-1.5 bg-black/30 rounded-xs overflow-hidden mb-2">
              <div
                className="h-full transition-all duration-500 rounded-xs"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>

            {/* Meta summary footer */}
            <div className={`flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pt-1 border-t ${isDark ? 'border-white/5 text-[#859588]' : 'border-slate-200 text-slate-500'}`}>
              <div className="flex items-center gap-1.5">
                <span>Mesin Deteksi:</span>
                <span className={isDark ? 'text-[#9CA7C5]' : 'text-slate-700'}>{item.engine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Estimasi Tagihan Berisiko:</span>
                <span className="font-bold" style={{ color: item.color }}>
                  Rp {item.amountM.toFixed(1)} Miliar
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate Financial Summary Banner */}
      <div className={`p-3 rounded-sm border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
        isDark ? 'bg-[#131735] border-white/8 text-[#DFE0FF]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#35F2A0]" />
          <span>TOTAL POTENSI FRAUD TERKONSOLIDASI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#859588]">
            {totalCount} Sinyal Multi-Fasilitas
          </span>
          <span className="text-sm font-bold font-mono text-[#FF5C67]">
            Rp {totalAmount.toFixed(1)} Miliar
          </span>
        </div>
      </div>
    </JagaCard>
  )
}

export default SignalBreakdownChart
