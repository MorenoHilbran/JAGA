import React from 'react'

/**
 * JagaButton - Defense-grade action button matching JAGA Design System (Design.md)
 *
 * Variants:
 * - primary: Signal Green (#35F2A0) bg, dark text (#080B24), bold font, 4px radius.
 *            Used for definitive triage: "Bekukan Klaim", "Otorisasi Intervensi", "Deploy Model".
 * - secondary: Tactical Secondary, transparent navy with 1px border rgba(255,255,255,0.12), white text.
 * - danger / critical: Critical Alert (#FF5C67), high-risk overrides or freeze actions.
 * - ghost: Minimal borderless, subtle hover for auxiliary tools.
 */
const JagaButton = ({
  children,
  variant = 'secondary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon = null,
  iconRight = null,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none'

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1.5 rounded-[2px]',
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-sm',
    md: 'px-4 py-2 text-sm gap-2 rounded-sm',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5 rounded-sm tracking-wide',
  }

  const variantStyles = {
    primary:
      'bg-[#35F2A0] text-[#080B24] font-bold shadow-[0_0_14px_rgba(53,242,160,0.25)] hover:bg-[#51FFAD] hover:shadow-[0_0_20px_rgba(53,242,160,0.4)] active:scale-[0.99] border border-transparent',
    secondary:
      'bg-[#0D1130] text-white border border-white/12 hover:bg-white/[0.06] hover:border-white/20 hover:text-white active:bg-white/[0.08] shadow-xs',
    tactical:
      'bg-[#131735] text-white border border-white/10 hover:border-[#35F2A0]/50 hover:text-[#35F2A0] hover:bg-[#131735] shadow-xs',
    danger:
      'bg-[#FF5C67] text-[#080B24] font-bold shadow-[0_0_14px_rgba(255,92,103,0.3)] hover:bg-[#FF737C] hover:shadow-[0_0_20px_rgba(255,92,103,0.5)] active:scale-[0.99] border border-transparent',
    'danger-ghost':
      'bg-transparent text-[#FF5C67] border border-[#FF5C67]/40 hover:bg-[#FF5C67]/10 hover:border-[#FF5C67] hover:text-[#FF8A92]',
    ghost:
      'bg-transparent text-[#BACBBD] hover:text-[#DFE0FF] hover:bg-white/[0.05] border border-transparent',
    outline:
      'bg-transparent text-[#35F2A0] border border-[#35F2A0]/40 hover:bg-[#35F2A0]/10 hover:border-[#35F2A0] hover:shadow-[0_0_10px_rgba(53,242,160,0.2)]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.secondary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!loading && iconRight ? (
        <span className="flex-shrink-0">{iconRight}</span>
      ) : null}
    </button>
  )
}

export default JagaButton
