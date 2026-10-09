import React from 'react'

/**
 * StatCard - Telemetry KPI / Metric Card
 * Displays sovereign system figures with tabular numbers and delta indicators.
 */
const StatCard = ({
  label,
  value,
  prefix = null,
  suffix = null,
  delta = null, // e.g. "+14.2%" or "-3.8%"
  deltaType = 'neutral', // 'positive' | 'negative' | 'neutral' | 'danger'
  caption = null,
  icon = null,
  variant = 'default', // 'default' | 'critical' | 'signal' | 'high'
  className = '',
}) => {
  const variantStyles = {
    default: {
      card: 'bg-[#0D1130] border-white/8',
      value: 'text-[#FFFFFF]',
      label: 'text-[#9CA7C5]',
      accent: 'border-l-2 border-transparent',
    },
    signal: {
      card: 'bg-[#0D1130] border-[#35F2A0]/25 shadow-[0_0_20px_rgba(53,242,160,0.06)]',
      value: 'text-[#35F2A0]',
      label: 'text-[#9CA7C5]',
      accent: 'border-l-2 border-[#35F2A0]',
    },
    critical: {
      card: 'bg-[#0D1130] border-[#FF5C67]/30 shadow-[0_0_20px_rgba(255,92,103,0.08)]',
      value: 'text-[#FF7A85]',
      label: 'text-[#9CA7C5]',
      accent: 'border-l-2 border-[#FF5C67]',
    },
    high: {
      card: 'bg-[#0D1130] border-[#FF9F43]/30 shadow-[0_0_20px_rgba(255,159,67,0.08)]',
      value: 'text-[#FFAE66]',
      label: 'text-[#9CA7C5]',
      accent: 'border-l-2 border-[#FF9F43]',
    },
  }[variant] || {
    card: 'bg-[#0D1130] border-white/8',
    value: 'text-[#FFFFFF]',
    label: 'text-[#9CA7C5]',
    accent: 'border-l-2 border-transparent',
  }

  const deltaStyles = {
    positive: 'text-[#35F2A0] bg-[#35F2A0]/10 border-[#35F2A0]/30',
    negative: 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30',
    danger: 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30',
    neutral: 'text-[#9CA7C5] bg-white/5 border-white/10',
  }[deltaType] || 'text-[#9CA7C5] bg-white/5 border-white/10'

  return (
    <div
      className={`
        relative p-4 rounded-sm border ${variantStyles.card} ${variantStyles.accent}
        transition-all duration-150 hover:border-white/20
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#859588] font-medium truncate">
          {label}
        </span>
        {icon && <span className="text-[#9CA7C5] flex-shrink-0">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        {prefix && (
          <span className="text-sm font-mono text-[#859588]">{prefix}</span>
        )}
        <span
          className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${variantStyles.value}`}
        >
          {value}
        </span>
        {suffix && (
          <span className="text-xs font-mono text-[#859588]">{suffix}</span>
        )}
      </div>

      {(delta || caption) && (
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/5">
          {caption && (
            <span className="text-[11px] text-[#859588] truncate">
              {caption}
            </span>
          )}
          {delta && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-[2px] border ${deltaStyles} ml-auto`}
            >
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default StatCard
