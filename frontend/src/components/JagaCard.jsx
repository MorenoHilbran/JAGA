import React from 'react'

/**
 * JagaCard - Sovereign Defense UI Container Card
 * Matches JAGA Design System (Design.md):
 * - Surface elevations (#0D1130, #131735, #1C2248, #283060)
 * - Ghost hairline borders (1px solid rgba(255, 255, 255, 0.08))
 * - 4px border radius (rounded-sm)
 * - Optional HUD corner accents, header slot, and action buttons
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
  const elevationStyles = {
    lowest: 'bg-[#080B24]',
    low: 'bg-[#0D1130]',
    container: 'bg-[#131735]',
    high: 'bg-[#1C2248]',
    highest: 'bg-[#283060]',
  }[elevation] || 'bg-[#131735]'

  return (
    <div
      className={`
        relative rounded-sm border border-white/8 ${elevationStyles}
        ${glow ? 'shadow-[0_0_24px_rgba(53,242,160,0.06)]' : ''}
        ${hoverable ? 'transition-all duration-150 hover:border-white/18 hover:bg-[#161B3D]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* HUD corner tactical markers */}
      {hudAccents && (
        <>
          <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-[#35F2A0]/70 pointer-events-none" />
          <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-[#35F2A0]/70 pointer-events-none" />
          <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-[#35F2A0]/70 pointer-events-none" />
          <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-[#35F2A0]/70 pointer-events-none" />
        </>
      )}

      {/* Header section if provided */}
      {(title || subtitle || badge || action) && (
        <div
          className={`
            px-4 py-3 border-b border-white/6 flex items-center justify-between gap-3
            ${headerClassName}
          `}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {title && (
                <h3 className="text-sm font-semibold text-[#DFE0FF] tracking-wide font-headline truncate">
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs text-[#9CA7C5] mt-0.5 line-clamp-1 font-sans">
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
