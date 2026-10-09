import React from 'react'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * JagaCard - Sovereign Defense UI Container Card
 * Adapts to Dark and Light modes.
 */
const JagaCard = ({
  children,
  elevation = 'container', // 'lowest' | 'low' | 'container' | 'high' | 'highest'
  title = null,
  subtitle = null,
  badge = null,
  action = null,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  hudAccents = false,
  glow = false,
  hoverable = false,
  ...props
}) => {
  const { isDark } = useJagaTheme()

  const darkElevation = {
    lowest: 'bg-[#080B24]',
    low: 'bg-[#0D1130]',
    container: 'bg-[#131735]',
    high: 'bg-[#1C2248]',
    highest: 'bg-[#283060]',
  }[elevation] || 'bg-[#131735]'

  const lightElevation = {
    lowest: 'bg-white',
    low: 'bg-white',
    container: 'bg-white',
    high: 'bg-slate-50',
    highest: 'bg-slate-100',
  }[elevation] || 'bg-white'

  return (
    <div
      className={`
        relative rounded-sm border
        ${isDark ? `border-white/8 ${darkElevation}` : `border-slate-200/80 shadow-xs ${lightElevation}`}
        ${glow ? (isDark ? 'shadow-[0_0_24px_rgba(53,242,160,0.06)]' : 'shadow-md') : ''}
        ${hoverable ? (isDark ? 'transition-all duration-150 hover:border-white/18 hover:bg-[#161B3D]' : 'transition-all duration-150 hover:border-slate-300 hover:shadow-sm') : ''}
        ${className}
      `}
      {...props}
    >
      {/* HUD corner tactical markers */}
      {hudAccents && (
        <>
          <div className={`absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l pointer-events-none ${isDark ? 'border-[#35F2A0]/70' : 'border-[#0B945B]/80'}`} />
          <div className={`absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r pointer-events-none ${isDark ? 'border-[#35F2A0]/70' : 'border-[#0B945B]/80'}`} />
          <div className={`absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l pointer-events-none ${isDark ? 'border-[#35F2A0]/70' : 'border-[#0B945B]/80'}`} />
          <div className={`absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r pointer-events-none ${isDark ? 'border-[#35F2A0]/70' : 'border-[#0B945B]/80'}`} />
        </>
      )}

      {/* Header section if provided */}
      {(title || subtitle || badge || action) && (
        <div
          className={`
            px-4 py-3 border-b flex items-center justify-between gap-3
            ${isDark ? 'border-white/6' : 'border-slate-200'}
            ${headerClassName}
          `}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {title && (
                <h3 className={`text-sm font-semibold tracking-wide font-headline truncate ${isDark ? 'text-[#DFE0FF]' : 'text-slate-800'}`}>
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className={`text-xs mt-0.5 line-clamp-1 font-sans ${isDark ? 'text-[#9CA7C5]' : 'text-slate-500'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Card Content Body */}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  )
}

export default JagaCard
