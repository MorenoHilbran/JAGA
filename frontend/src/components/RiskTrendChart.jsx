import React, { useState } from 'react'
import {
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Info,
} from 'lucide-react'
import JagaCard from './JagaCard'
import JagaButton from './JagaButton'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * RiskTrendChart - Macro Longitudinal Risk Trend Visualizer
 * Pure SVG vector charting compliant with Palantir Defense design system.
 * Shows temporal anomaly volume, critical fraud detections, and financial exposure.
 */
const RiskTrendChart = ({
  data = null,
  title = 'Tren Deteksi Risiko & Volume Anomali (30 Hari Terakhir)',
}) => {
  const { isDark } = useJagaTheme()

  const defaultTrendData = [
    { day: '01 Sep', cloning: 4, referral: 2, repeat: 1, los: 0, amountM: 2.1 },
    { day: '04 Sep', cloning: 6, referral: 3, repeat: 2, los: 1, amountM: 4.8 },
    { day: '07 Sep', cloning: 5, referral: 5, repeat: 1, los: 2, amountM: 6.2 },
    { day: '10 Sep', cloning: 8, referral: 7, repeat: 3, los: 1, amountM: 9.4 },
    { day: '13 Sep', cloning: 7, referral: 8, repeat: 2, los: 3, amountM: 11.0 },
    { day: '16 Sep', cloning: 12, referral: 11, repeat: 4, los: 2, amountM: 18.5 },
    { day: '19 Sep', cloning: 14, referral: 13, repeat: 3, los: 4, amountM: 22.8 },
    { day: '22 Sep', cloning: 19, referral: 16, repeat: 5, los: 3, amountM: 29.1 },
    { day: '25 Sep', cloning: 23, referral: 18, repeat: 6, los: 5, amountM: 37.4 },
    { day: '28 Sep', cloning: 29, referral: 22, repeat: 8, los: 6, amountM: 44.0 },
    { day: '01 Okt', cloning: 34, referral: 26, repeat: 7, los: 7, amountM: 52.8 },
    { day: '04 Okt', cloning: 41, referral: 31, repeat: 9, los: 8, amountM: 68.3 },
    { day: '07 Okt', cloning: 52, referral: 38, repeat: 11, los: 9, amountM: 84.6 },
    { day: '10 Okt', cloning: 67, referral: 48, repeat: 14, los: 12, amountM: 112.5 },
  ]

  const chartData = data || defaultTrendData
  const [activeSeries, setActiveSeries] = useState({
    cloning: true,
    referral: true,
    repeat: true,
    amount: true,
  })
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Dimensions
  const width = 800
  const height = 260
  const padLeft = 45
  const padRight = 45
  const padTop = 25
  const padBottom = 35

  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom

  const maxSignals = 70
  const maxAmount = 120

  const getX = (index) => padLeft + (index / (chartData.length - 1)) * chartW
  const getYSignals = (val) => padTop + chartH - (val / maxSignals) * chartH
  const getYAmount = (val) => padTop + chartH - (val / maxAmount) * chartH

  const makePath = (key, getYFn) => {
    return chartData.reduce((acc, d, i) => {
      const x = getX(i)
      const y = getYFn(d[key])
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
    }, '')
  }

  const makeAreaPath = (key, getYFn) => {
    const linePath = makePath(key, getYFn)
    const lastX = getX(chartData.length - 1)
    const firstX = getX(0)
    const bottomY = padTop + chartH
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
  }

  return (
    <JagaCard
      elevation="low"
      title={title}
      subtitle="Monitoring longitudinal lonjakan rujukan sirkular, kloning klaim, dan agregat nominal risiko"
      badge={
        <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border ${isDark ? 'bg-[#35F2A0]/10 border-[#35F2A0]/30 text-[#35F2A0]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          LONGITUDINAL TELEMETRY
        </span>
      }
      action={
        <div className="flex items-center gap-1.5">
          <JagaButton
            size="xs"
            variant="ghost"
            onClick={() => alert('Grafik tren berhasil diekspor sebagai CSV.')}
            icon={<Download className="w-3 h-3" />}
          >
            Ekspor Data
          </JagaButton>
        </div>
      }
      hudAccents={true}
      bodyClassName="p-4 space-y-3"
    >
      {/* Legend & Series Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/6 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSeries((p) => ({ ...p, cloning: !p.cloning }))}
            className={`flex items-center gap-1.5 transition-opacity ${activeSeries.cloning ? 'opacity-100' : 'opacity-40'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C67]" />
            <span className={isDark ? 'text-white' : 'text-slate-800'}>Kloning Berkas (Cloning)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries((p) => ({ ...p, referral: !p.referral }))}
            className={`flex items-center gap-1.5 transition-opacity ${activeSeries.referral ? 'opacity-100' : 'opacity-40'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9F43]" />
            <span className={isDark ? 'text-white' : 'text-slate-800'}>Rujukan Sirkular (Graph)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries((p) => ({ ...p, repeat: !p.repeat }))}
            className={`flex items-center gap-1.5 transition-opacity ${activeSeries.repeat ? 'opacity-100' : 'opacity-40'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#35F2A0]" />
            <span className={isDark ? 'text-white' : 'text-slate-800'}>Repeat Billing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries((p) => ({ ...p, amount: !p.amount }))}
            className={`flex items-center gap-1.5 transition-opacity ${activeSeries.amount ? 'opacity-100' : 'opacity-40'}`}
          >
            <span className="w-2.5 h-1.5 rounded-xs bg-[#c1c4ec] border border-[#3E497A]" />
            <span className={isDark ? 'text-[#c1c4ec]' : 'text-indigo-700'}>Nominal Klaim (Miliar Rp)</span>
          </button>
        </div>

        <div className={`text-[11px] ${isDark ? 'text-[#859588]' : 'text-slate-400'}`}>
          Agregat 67 Kluster Aktif
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Grids and Axes */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padTop + chartH * ratio
            const sigVal = Math.round(maxSignals * (1 - ratio))
            const amtVal = Math.round(maxAmount * (1 - ratio))
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  strokeDasharray="3 3"
                />
                {/* Left Y Axis (Signals count) */}
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill={isDark ? '#859588' : '#94A3B8'}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {sigVal}
                </text>
                {/* Right Y Axis (Amount in Miliar) */}
                <text
                  x={width - padRight + 8}
                  y={y + 3}
                  textAnchor="start"
                  fill={isDark ? '#859588' : '#94A3B8'}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {amtVal}M
                </text>
              </g>
            )
          })}

          {/* Area under Cloning */}
          {activeSeries.cloning && (
            <path
              d={makeAreaPath('cloning', getYSignals)}
              fill="url(#cloningGrad)"
              opacity="0.3"
            />
          )}

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="cloningGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5C67" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF5C67" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="referralGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF9F43" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Lines */}
          {activeSeries.amount && (
            <path
              d={makePath('amountM', getYAmount)}
              fill="none"
              stroke="#c1c4ec"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {activeSeries.repeat && (
            <path
              d={makePath('repeat', getYSignals)}
              fill="none"
              stroke="#35F2A0"
              strokeWidth="2"
            />
          )}

          {activeSeries.referral && (
            <path
              d={makePath('referral', getYSignals)}
              fill="none"
              stroke="#FF9F43"
              strokeWidth="2.5"
            />
          )}

          {activeSeries.cloning && (
            <path
              d={makePath('cloning', getYSignals)}
              fill="none"
              stroke="#FF5C67"
              strokeWidth="3"
            />
          )}

          {/* Interactive dots and vertical hover bar */}
          {chartData.map((d, i) => {
            const x = getX(i)
            const isHovered = hoveredPoint?.index === i

            return (
              <g key={i} className="cursor-pointer">
                {/* Invisible hover area */}
                <rect
                  x={x - chartW / (chartData.length * 2)}
                  y={padTop}
                  width={chartW / chartData.length}
                  height={chartH}
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint({ ...d, index: i, x })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* X axis labels */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? (isDark ? '#35F2A0' : '#0B945B') : isDark ? '#859588' : '#94A3B8'}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.day}
                </text>

                {/* Dots on line points */}
                {activeSeries.cloning && (
                  <circle
                    cx={x}
                    cy={getYSignals(d.cloning)}
                    r={isHovered ? 5 : 3}
                    fill="#FF5C67"
                    stroke={isDark ? '#0D1130' : '#FFFFFF'}
                    strokeWidth="1.5"
                  />
                )}
              </g>
            )
          })}

          {/* Hover Crosshair & Tooltip Overlay */}
          {hoveredPoint && (
            <g pointerEvents="none">
              <line
                x1={hoveredPoint.x}
                y1={padTop}
                x2={hoveredPoint.x}
                y2={padTop + chartH}
                stroke={isDark ? '#35F2A0' : '#0B945B'}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip HUD Card */}
        {hoveredPoint && (
          <div
            className={`absolute top-2 z-20 p-2.5 rounded-sm border shadow-xl text-xs font-mono pointer-events-none ${
              isDark ? 'bg-[#0D1130]/95 border-white/15 text-white' : 'bg-white/95 border-slate-300 text-slate-800'
            }`}
            style={{
              left: Math.min(hoveredPoint.x + 10, width - 200),
            }}
          >
            <div className={`font-bold pb-1 mb-1 border-b ${isDark ? 'border-white/10 text-[#35F2A0]' : 'border-slate-200 text-emerald-700'}`}>
              PERIODE: {hoveredPoint.day} 2026
            </div>
            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between gap-4">
                <span className="text-[#FF5C67]">Kloning Klaim:</span>
                <span className="font-bold">{hoveredPoint.cloning} kasus</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#FF9F43]">Rujukan Sirkular:</span>
                <span className="font-bold">{hoveredPoint.referral} kasus</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#35F2A0]">Repeat Billing:</span>
                <span className="font-bold">{hoveredPoint.repeat} kasus</span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-white/6 font-bold">
                <span className={isDark ? 'text-[#c1c4ec]' : 'text-indigo-600'}>Eksposur Risiko:</span>
                <span>Rp {hoveredPoint.amountM} Miliar</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </JagaCard>
  )
}

export default RiskTrendChart
