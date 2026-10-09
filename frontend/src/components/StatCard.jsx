import React from 'react'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * StatCard - Telemetry KPI / Metric Card
 * Displays sovereign system figures with tabular numbers and delta indicators.
 * Adapts seamlessly between Dark and Light mode.
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
  const { isDark } = useJagaTheme()

  const darkStyles = {
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

  const lightStyles = {
    default: {
      card: 'bg-white border-slate-200 shadow-xs',
      value: 'text-slate-900',
      label: 'text-slate-500',
      accent: 'border-l-2 border-slate-300',
    },
    signal: {
      card: 'bg-white border-[#0B945B]/30 shadow-xs',
      value: 'text-[#0B945B]',
      label: 'text-slate-500',
      accent: 'border-l-2 border-[#0B945B]',
    },
    critical: {
      card: 'bg-white border-red-200 shadow-xs',
      value: 'text-red-600',
      label: 'text-slate-500',
      accent: 'border-l-2 border-red-500',
    },
    high: {
      card: 'bg-white border-amber-200 shadow-xs',
      value: 'text-amber-600',
      label: 'text-slate-500',
      accent: 'border-l-2 border-amber-500',
    },
  }[variant] || {
    card: 'bg-white border-slate-200 shadow-xs',
    value: 'text-slate-900',
    label: 'text-slate-500',
    accent: 'border-l-2 border-slate-300',
  }

  const activeStyles = isDark ? darkStyles : lightStyles

  const deltaStyles = isDark
    ? {
        positive: 'text-[#35F2A0] bg-[#35F2A0]/10 border-[#35F2A0]/30',
        negative: 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30',
        danger: 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30',
        neutral: 'text-[#9CA7C5] bg-white/5 border-white/10',
      }[deltaType] || 'text-[#9CA7C5] bg-white/5 border-white/10'
    : {
        positive: 'text-[#0B945B] bg-emerald-50 border-emerald-200',
        negative: 'text-red-700 bg-red-50 border-red-200',
        danger: 'text-red-700 bg-red-50 border-red-200',
        neutral: 'text-slate-600 bg-slate-100 border-slate-200',
      }[deltaType] || 'text-slate-600 bg-slate-100 border-slate-200'

  return (
    <div
      className={`
        relative p-4 rounded-sm border ${activeStyles.card} ${activeStyles.accent}
        transition-all duration-150 ${isDark ? 'hover:border-white/20' : 'hover:border-slate-300 hover:shadow-sm'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[11px] font-mono tracking-wider uppercase font-medium truncate ${activeStyles.label}`}>
          {label}
        </span>
        {icon && <span className={`${isDark ? 'text-[#9CA7C5]' : 'text-slate-400'} flex-shrink-0`}>{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        {prefix && (
          <span className={`text-sm font-mono ${isDark ? 'text-[#859588]' : 'text-slate-400'}`}>{prefix}</span>
        )}
        <span
          className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${activeStyles.value}`}
        >
          {value}
        </span>
        {suffix && (
          <span className={`text-xs font-mono ${isDark ? 'text-[#859588]' : 'text-slate-400'}`}>{suffix}</span>
        )}
      </div>

      {(delta || caption) && (
        <div className={`flex items-center justify-between gap-2 mt-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          {caption && (
            <span className={`text-[11px] truncate ${isDark ? 'text-[#859588]' : 'text-slate-400'}`}>
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
