import React from 'react'

/**
 * RiskBadge - Sovereign Anomaly Chip & Risk Status Badge
 * Matches JAGA Design System (Design.md):
 * - 1px stroke, tinted translucent fill (rgba(..., 0.12))
 * - JetBrains Mono label text (font-mono)
 * - Variants: CRITICAL (#FF5C67), HIGH (#FF9F43), MEDIUM (#FCD34D), LOW/VERIFIED (#35F2A0)
 */
const RiskBadge = ({
  category = 'MEDIUM',
  score = null,
  label = null,
  size = 'sm',
  pulse = false,
  className = '',
}) => {
  const normCategory = (category || 'LOW').toUpperCase()

  const config = {
    CRITICAL: {
      text: 'text-[#FF7A85]',
      border: 'border-[#FF5C67]/50',
      bg: 'bg-[#FF5C67]/10',
      dot: 'bg-[#FF5C67]',
      glow: 'shadow-[0_0_8px_rgba(255,92,103,0.3)]',
      defaultLabel: 'CRITICAL',
    },
    HIGH: {
      text: 'text-[#FFAE66]',
      border: 'border-[#FF9F43]/50',
      bg: 'bg-[#FF9F43]/10',
      dot: 'bg-[#FF9F43]',
      glow: 'shadow-[0_0_8px_rgba(255,159,67,0.25)]',
      defaultLabel: 'HIGH RISK',
    },
    MEDIUM: {
      text: 'text-[#FDE047]',
      border: 'border-[#EAB308]/50',
      bg: 'bg-[#EAB308]/10',
      dot: 'bg-[#EAB308]',
      glow: '',
      defaultLabel: 'MEDIUM',
    },
    LOW: {
      text: 'text-[#35F2A0]',
      border: 'border-[#35F2A0]/40',
      bg: 'bg-[#35F2A0]/10',
      dot: 'bg-[#35F2A0]',
      glow: '',
      defaultLabel: 'LOW',
    },
    VERIFIED: {
      text: 'text-[#35F2A0]',
      border: 'border-[#35F2A0]/40',
      bg: 'bg-[#35F2A0]/10',
      dot: 'bg-[#35F2A0]',
      glow: '',
      defaultLabel: 'TERVERIFIKASI',
    },
    MONITOR: {
      text: 'text-[#9CA7C5]',
      border: 'border-white/15',
      bg: 'bg-white/[0.04]',
      dot: 'bg-[#9CA7C5]',
      glow: '',
      defaultLabel: 'MONITORING',
    },
  }[normCategory] || {
    text: 'text-[#BACBBD]',
    border: 'border-white/15',
    bg: 'bg-white/[0.04]',
    dot: 'bg-[#BACBBD]',
    glow: '',
    defaultLabel: normCategory,
  }

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded-[2px]',
    sm: 'px-2 py-0.5 text-xs gap-1.5 rounded-sm',
    md: 'px-2.5 py-1 text-xs gap-2 rounded-sm',
    lg: 'px-3 py-1.5 text-sm gap-2 rounded-sm',
  }[size] || 'px-2 py-0.5 text-xs gap-1.5 rounded-sm'

  const displayText = label || config.defaultLabel

  return (
    <span
      className={`
        inline-flex items-center font-mono tracking-wider font-semibold uppercase
        border ${config.border} ${config.bg} ${config.text} ${config.glow}
        ${sizeStyles} ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}
          />
        </span>
      )}

      <span>{displayText}</span>

      {score !== null && score !== undefined && (
        <span className="opacity-80 pl-1 border-l border-current/25 font-mono tabular-nums">
          {typeof score === 'number' ? (score <= 1 ? `${(score * 100).toFixed(1)}%` : `${score}`) : score}
        </span>
      )}
    </span>
  )
}

export default RiskBadge
