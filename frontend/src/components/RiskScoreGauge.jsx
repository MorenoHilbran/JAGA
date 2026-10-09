import React from 'react'

/**
 * RiskScoreGauge - Compact Circular & Bar Gauge for Fraud Risk Scores (0-100)
 * Design.md: Color coded based on risk thresholds:
 * - 0-39: Low (#35F2A0)
 * - 40-69: Medium (#FCD34D)
 * - 70-84: High (#FF9F43)
 * - 85-100: Critical (#FF5C67)
 */
const RiskScoreGauge = ({
  score = 0,
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = true,
  variant = 'circular', // 'circular' | 'bar'
  className = '',
}) => {
  const numScore = Math.min(100, Math.max(0, Number(score) || 0))

  const getColor = (s) => {
    if (s >= 85) return { color: '#FF5C67', label: 'CRIT', glow: 'rgba(255, 92, 103, 0.4)' }
    if (s >= 70) return { color: '#FF9F43', label: 'HIGH', glow: 'rgba(255, 159, 67, 0.4)' }
    if (s >= 40) return { color: '#FCD34D', label: 'MED', glow: 'rgba(252, 211, 77, 0.3)' }
    return { color: '#35F2A0', label: 'LOW', glow: 'rgba(53, 242, 160, 0.3)' }
  }

  const { color, label, glow } = getColor(numScore)

  if (variant === 'bar') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${numScore}%`, backgroundColor: color, boxShadow: `0 0 6px ${glow}` }}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-mono font-bold tabular-nums" style={{ color }}>
            {numScore}
          </span>
        )}
      </div>
    )
  }

  const dim = {
    sm: { size: 32, stroke: 3, fontSize: 'text-[10px]' },
    md: { size: 44, stroke: 3.5, fontSize: 'text-xs' },
    lg: { size: 64, stroke: 4.5, fontSize: 'text-sm' },
  }[size] || { size: 44, stroke: 3.5, fontSize: 'text-xs' }

  const radius = (dim.size - dim.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (numScore / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={dim.size} height={dim.size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={dim.stroke}
          fill="transparent"
        />
        {/* Dynamic score track */}
        <circle
          cx={dim.size / 2}
          cy={dim.size / 2}
          r={radius}
          stroke={color}
          strokeWidth={dim.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 4px ${glow})`,
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span className={`font-bold tabular-nums leading-none ${dim.fontSize}`} style={{ color }}>
            {numScore}
          </span>
        </div>
      )}
    </div>
  )
}

export default RiskScoreGauge
